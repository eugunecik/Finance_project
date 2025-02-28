import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto';
import { AppError } from 'src/common/constants/errors';
import { UserLoginDto } from './dto';
import * as bcrypt from "bcrypt";
import { AuthUserResponse } from './response';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly tokenService: TokenService
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
        const userData={
            name:existUser.firstName,
            email:existUser.email
        }
        const token = await this.tokenService.generateJwtToken(userData);
        const user = await this.userService.publicUser(dto.email);
        return { ...user, token } as AuthUserResponse; 
    }
}