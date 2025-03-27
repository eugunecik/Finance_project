import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';


export class CreateUserDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6) 
  password: string;
}


export class UpdateUserDto {
    @ApiProperty({ required: false })
    @IsString()
    firstName?: string;
  
    @ApiProperty({ required: false })
    @IsString()
    username?: string;
  
    @ApiProperty({ required: false })
    @IsString()
    email?: string;
  
    @ApiProperty({ required: false })
    @IsString()
    @MinLength(6)
    password?: string; }