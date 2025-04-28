import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';
import { User } from './models/user.model';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('create-user')
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(dto);
  }

  @ApiOperation({ summary: 'Update user data' })
  @ApiResponse({ status: 200, description: 'User successfully updated', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateUser(@Body() updateDto: UpdateUserDto, @Req() request): Promise<User | null> {
    const user = request.user;
    return this.usersService.updateUser(user.email, updateDto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User successfully deleted', type: Boolean })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUser(@Req() request): Promise<boolean> {
    const user = request.user;
    return this.usersService.deleteUser(user.email);
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profileOfUser(@Req() request): Promise<User | null> {
    const user = request.user;
    return this.usersService.publicUser(user.email);
  }
}