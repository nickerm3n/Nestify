import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto/create-group.dto';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { UpdateGroupDto } from './dto/update-group.dto/update-group.dto';

@Controller()
export class GroupController {
  constructor(private readonly groupService: GroupService) {}
  @Get('groups')
  getAllGroups() {
    return this.groupService.getAllGroups();
  }
  @Get('groups/:id')
  getGroupById(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.getGroupById(id);
  }

  @Post('group')
  createGroup(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.createGroup(createGroupDto);
  }

  @Patch('group/:id')
  updateGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupService.updateGroup(id, updateGroupDto);
  }

  @Delete('group/:id')
  deleteGroup(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.deleteGroup(id);
  }

  @Post('groups/:id/addUsers')
  addUsersToGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body('userIds') userIds: string[],
  ) {
    const ids = userIds.map((id) => parseInt(id, 10));
    return this.groupService.addUsersToGroup(id, ids);
  }
}
