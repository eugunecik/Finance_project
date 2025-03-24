import { Body, Controller,Delete,Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto,UpdatePasswordDto } from './dto';
import path from 'path';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
@Controller('users')
export class UsersController {
constructor(private readonly usersService:UsersService){}
@Post('create-user')
createUsers(@Body() dto:CreateUserDto){
    return this.usersService.createUser(dto);
}
@ApiTags("API")
@ApiResponse({status:200,type:UpdateUserDto})
@UseGuards(JwtAuthGuard)
@Patch()
updateUser(@Body()updateDto:UpdateUserDto, @Req() request ): Promise<UpdateUserDto>{
    const user=request.user
    return this.usersService.updateUser(user.email,updateDto)
}
@ApiTags("API")
@ApiResponse({ status: 200, description: 'Password updated successfully' })
@ApiResponse({ status: 400, description: 'Bad request - invalid credentials' })
@Post('update-password')
async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    const { email, currentPassword, newPassword } = updatePasswordDto;
    return this.usersService.updatePassword(email, currentPassword, newPassword);
}
@UseGuards(JwtAuthGuard)
@Delete()
async deleteUser(@Req() request ){
    const user=request.user
    return this.usersService.deleteUser(user.email)
}
@UseGuards(JwtAuthGuard)
@Get("profile")
async profileofUser(@Req() request) {
  const user = request.user;
  return this.usersService.publicUser(user.email);
}
}