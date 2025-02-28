import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto';
import { UserLoginDto } from './dto';
import { AuthUserResponse } from './response';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-guard';

@Controller('auth')
export class AuthController {
constructor(private readonly authService:AuthService){}
    @ApiTags('API')
    @ApiResponse({status:201,type:CreateUserDto})
    @Post('register')
    register(@Body() dto:CreateUserDto):Promise<CreateUserDto>{
        return this.authService.registerUsers(dto)

        
    }
    @ApiTags('API')
    @ApiResponse({status:200,type:AuthUserResponse})
    @Post('login')
    login(@Body() dto:UserLoginDto):Promise<AuthUserResponse>{
      return this.authService.loginUsers(dto)
    }
    @UseGuards(JwtAuthGuard)
    @Post('test')
    test(){return true;}

  
}
