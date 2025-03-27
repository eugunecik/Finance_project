import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { TokenModule } from 'src/token/token.module';
import { JwtStrategy } from 'src/strategy';
import { EmailService } from '../email/email.service'; 

@Module({
  imports: [UsersModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, EmailService], 
})
export class AuthModule {}