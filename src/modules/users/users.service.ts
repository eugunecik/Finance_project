import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashPassword(dto.password);
    const user = await this.userRepository.create({
      firstName: dto.firstName,
      username: dto.username,
      password: hashedPassword,
      email: dto.email,
    });
    return user;
  }

  async publicUser(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      attributes: { exclude: ['password'] },
    });
  }

  async updateUser(email: string, dto: UpdateUserDto): Promise<User | null> {
    await this.userRepository.update(dto, { where: { email } });
    return this.findUserByEmail(email);
  }

  async deleteUser(email: string): Promise<boolean> {
    const deleted = await this.userRepository.destroy({ where: { email } });
    return deleted > 0;
  }
}
