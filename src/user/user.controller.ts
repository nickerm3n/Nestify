import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';

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
  getUserById(@Param('id') id) {
    return this.users.find((user) => user.id === +id);
  }

  @Post('user')
  createUser(@Body() body) {
    this.users.push(body);
    return body;
  }

  @Patch('user/:id')
  updateUser(@Param('id') id, @Body() body) {
    return this.users.map((user) => {
      if (user.id === +id) {
        return body;
      }
      return user;
    });
  }

  @Delete('user/:id')
  deleteUser(@Param('id') id) {
    return this.users.map((user) => {
      if (user.id === +id) {
        user.isDeleted = true;
      }
      return user;
    });
  }

  @Get('users')
  getAutoSuggestUsers(
    @Query('loginSubstring') loginSubstring,
    @Query('limit') limit,
  ) {
    console.log(loginSubstring, limit);
    return `${limit} ${loginSubstring} 1`;
  }
}
