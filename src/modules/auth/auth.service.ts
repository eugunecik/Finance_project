import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto, UpdateUserDto } from '../users/dto'; 
import { AppError } from 'src/common/constants/errors';
import { UserLoginDto } from './dto';
import * as bcrypt from 'bcrypt';
import { AuthUserResponse } from './response';
import { TokenService } from 'src/token/token.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

  async registerUsers(dto: CreateUserDto): Promise<CreateUserDto> {
    const existUser = await this.userService.findUserByEmail(dto.email);
    
    if (existUser) {
      throw new BadRequestException(AppError.USER_EXIST);
    }
    
    return this.userService.createUser(dto);
  }

  async loginUsers(dto: UserLoginDto): Promise<AuthUserResponse> {
    const existUser = await this.userService.findUserByEmail(dto.email);
    
    if (!existUser) {
      throw new BadRequestException(AppError.USER_NOT_EXIST);
    }
    
    const validatePassword = await bcrypt.compare(dto.password, existUser.password);
    
    if (!validatePassword) {
      throw new BadRequestException(AppError.WRONG_DATA);
    }
    
    const userData = {
      name: existUser.firstName,
      email: existUser.email,
      userId: existUser.id,
    };
    
    const token = await this.tokenService.generateJwtToken(userData);
    const user = await this.userService.publicUser(dto.email);
    
    return { ...user, token } as AuthUserResponse;
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userService.findUserByEmail(email);
    
    if (!user) {
      throw new BadRequestException(AppError.USER_NOT_EXIST);
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetToken = await this.tokenService.generateResetToken(email, resetCode);

    await this.emailService.sendMail(
      email,
      'Скидання пароля',
      `Ваш код для скидання пароля: ${resetCode}. Код дійсний протягом 1 години.`,
    );
  }

  async resetPassword(email: string, resetCode: string, newPassword: string): Promise<void> {
    const isValid = await this.tokenService.verifyResetToken(email, resetCode);
    
    if (!isValid) {
      throw new BadRequestException(AppError.INVALID_TOKEN);
    }

    const user = await this.userService.findUserByEmail(email);
    
    if (!user) {
      throw new BadRequestException(AppError.USER_NOT_EXIST);
    }

    if (!newPassword) {
      throw new BadRequestException(AppError.NEW_PASSWORD_REQUIRED);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.updateUser(email, { password: hashedPassword });
  }
}