import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto, UpdateUserDto } from '../users/dto'; // Переконайся, що імпорт правильний
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
    if (existUser) throw new BadRequestException(AppError.USER_EXIST);
    return this.userService.createUser(dto);
  }

  async loginUsers(dto: UserLoginDto): Promise<AuthUserResponse> {
    const existUser = await this.userService.findUserByEmail(dto.email);
    if (!existUser) throw new BadRequestException(AppError.USER_NOT_EXIST);
    const validatePassword = await bcrypt.compare(dto.password, existUser.password);
    if (!validatePassword) throw new BadRequestException(AppError.WRONG_DATA);
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
    if (!user) throw new BadRequestException(AppError.USER_NOT_EXIST);

    const resetToken = await this.tokenService.generateResetToken(email);
    const resetLink = `http://localhost:3000/auth/reset-password?token=${resetToken}`;

    await this.emailService.sendMail(
      email,
      'Скидання пароля',
      `Перейдіть за посиланням для скидання пароля: ${resetLink}`,
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const payload = await this.tokenService.verifyResetToken(token);
    if (!payload || !payload.email) throw new BadRequestException(AppError.INVALID_TOKEN);

    const user = await this.userService.findUserByEmail(payload.email);
    if (!user) throw new BadRequestException(AppError.USER_NOT_EXIST);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.updateUser(payload.email, { password: hashedPassword });
  }
}