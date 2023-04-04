import { Injectable, NotFoundException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserById(id: string) {
    const user = await this.userRepository.findOneBy({ id: +id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create({
      ...createUserDto,
      isDeleted: false,
    });
    return this.userRepository.save(user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id: +id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.userRepository.save(user);
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOneBy({ id: +id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    user.isDeleted = true;
    return this.userRepository.save(user);
  }

  async getAutoSuggestUsers(loginSubstring: string, limit: string) {
    const users = this.userRepository.find({
      where: {
        login: Like(`%${loginSubstring}%`),
        isDeleted: false,
      },
      take: parseInt(limit, 10),
    });
    if (!users) {
      throw new NotFoundException(`Users not found`);
    }
    return users;
  }
}
