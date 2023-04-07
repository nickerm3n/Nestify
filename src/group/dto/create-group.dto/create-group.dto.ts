import { Permissions } from '../../constants/group.contstans';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsIn(
    [
      Permissions.READ,
      Permissions.WRITE,
      Permissions.DELETE,
      Permissions.SHARE,
      Permissions.UPLOAD_FILES,
    ],
    {
      message: `Permission must be one of the following: ${Permissions.READ}, ${Permissions.WRITE}, ${Permissions.UPLOAD_FILES}, ${Permissions.SHARE}, ${Permissions.UPLOAD_FILES}`,
      each: true,
    },
  )
  permissions: Permissions[];
}
