import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User\'s first name',
    example: 'John'
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'User\'s username',
    example: 'john2024'
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'User\'s email address',
    example: 'john@example.com'
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'User\'s password',
    example: 'securePassword123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'User\'s first name',
    example: 'John',
    required: false
  })
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'User\'s username',
    example: 'john2024',
    required: false
  })
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'User\'s email address',
    example: 'john@example.com',
    required: false
  })
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'User\'s password',
    example: 'securePassword123',
    minLength: 6,
    required: false
  })
  @IsString()
  @MinLength(6)
  password?: string;
}