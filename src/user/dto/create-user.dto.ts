import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsInt()
  @Min(4)
  @Max(120)
  age: number;
}
