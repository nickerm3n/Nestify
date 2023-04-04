import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DatabaseSeederService } from './database/database-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, DatabaseSeederService],
})
export class UserModule {}
