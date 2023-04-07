import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto/create-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Equal, Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { UpdateGroupDto } from './dto/update-group.dto/update-group.dto';
import { UserGroup } from './entities/user-group.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
  ) {}

  async createGroup(createGroupDto: CreateGroupDto) {
    const group = await this.groupRepository.create(createGroupDto);
    return this.groupRepository.save(group);
  }

  getAllGroups() {
    return this.groupRepository.find();
  }

  getAllUsersGroups() {
    return this.userGroupRepository.find({
      relations: ['user', 'group'],
    });
  }

  async getGroupById(id: number) {
    const group = await this.groupRepository.findOneBy({ id });
    if (!group) {
      throw new NotFoundException('GroupEntity not found');
    }
    return group;
  }

  async updateGroup(id: number, updateGroupDto: UpdateGroupDto) {
    const group = await this.getGroupById(id);
    if (!group) {
      throw new NotFoundException('GroupEntity not found');
    }
    return this.groupRepository.save({ ...group, ...updateGroupDto });
  }

  async deleteGroup(id: number) {
    const group = await this.getGroupById(id);
    if (!group) {
      throw new NotFoundException('GroupEntity not found');
    }
    return this.groupRepository.delete(id);
  }

  async addUsersToGroup(id: number, userIds: number[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const createdUserGroups = [];

    try {
      const [group, users] = await Promise.all([
        this.getGroupById(id),
        this.preloadUsers(userIds),
      ]);

      const userGroupRepo = queryRunner.manager.getRepository(UserGroup);

      const userGroupPromises = users.map(async (user) => {
        const existingUserGroup = await userGroupRepo.findOne({
          where: { user: Equal(user.id), group: Equal(group.id) },
          relations: ['user', 'group'],
        });

        if (existingUserGroup) {
          return existingUserGroup;
        }

        const userGroup = new UserGroup();
        userGroup.group = group;
        userGroup.user = user;
        return userGroupRepo.save(userGroup);
      });

      createdUserGroups.push(...(await Promise.all(userGroupPromises)));

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return createdUserGroups;
  }

  async preloadUsers(userIds: number[]) {
    const users = await this.userService.getUsersByIds(userIds);
    if (users.length !== userIds.length) {
      throw new NotFoundException('UserEntity not found');
    }
    return users;
  }
}
