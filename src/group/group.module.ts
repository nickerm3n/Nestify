import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { UserGroup } from './entities/user-group.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Group, UserGroup, User]), UserModule],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
