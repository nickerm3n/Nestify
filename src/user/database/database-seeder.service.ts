import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { mockUsers } from './mock-users';

@Injectable()
export class DatabaseSeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async seedUsers() {
    const users = this.userRepository.create(mockUsers);
    await this.userRepository.save(users);
  }

  async clearDatabase() {
    await this.userRepository.clear();
  }

  async resetPrimaryKeySequence() {
    const tableName = this.userRepository.metadata.tableName;
    await this.dataSource.query(
      `ALTER SEQUENCE "${tableName}_id_seq" RESTART WITH 1`,
    );
  }
}
