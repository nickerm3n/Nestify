import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UserController {
  private readonly users = [
    {
      id: 1,
      login: 'user1',
      password: 'password1',
      age: 20,
      isDeleted: false,
    },
  ];

  constructor(private readonly userService: UserService) {}

  @Get('user/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Post('user')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Patch('user/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete('user/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  @Get('users')
  getAutoSuggestUsers(
    @Query('loginSubstring') loginSubstring: string,
    @Query('limit') limit: string,
  ) {
    return this.userService.getAutoSuggestUsers(loginSubstring, limit);
  }
}
