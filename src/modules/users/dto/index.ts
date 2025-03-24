import { ApiProperty } from "@nestjs/swagger"
import { IsString,MinLength } from "class-validator"

export class CreateUserDto{
    @ApiProperty()
    @IsString()
    firstName:string
    @ApiProperty()
    @IsString()
    username:string
    @ApiProperty()
    @IsString()
    email:string
    @ApiProperty()
    @IsString()
    password:string
}


export class UpdatePasswordDto {
    @ApiProperty({ description: 'User email for identification' })
    @IsString()
    email: string;

    @ApiProperty({ description: 'Current password for verification' })
    @IsString()
    currentPassword: string;

    @ApiProperty({ description: 'New password to set', minimum: 6 })
    @IsString()
    @MinLength(6)
    newPassword: string;
}
export class UpdateUserDto{
    @ApiProperty()
    @IsString()
    firstName:string
    @ApiProperty()
    @IsString()
    username:string
    @ApiProperty()
    @IsString()
    email:string
}