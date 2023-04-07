import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto/create-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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

  async getAllGroups() {
    return this.groupRepository.find({
      relations: ['users'],
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
    try {
      const group = await this.getGroupById(id);
      const users = await this.preloadUsers(userIds);

      const userGroup = users.map((user) => {
        const userGroup = new UserGroup();
        userGroup.group = group;
        userGroup.user = user;
        return userGroup;
      });

      await queryRunner.manager.save(userGroup);
      await queryRunner.commitTransaction();
      return group;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async preloadUsers(userIds: number[]) {
    const users = await this.userService.getUsersByIds(userIds);
    if (users.length !== userIds.length) {
      throw new NotFoundException('UserEntity not found');
    }
    return users;
  }
}
