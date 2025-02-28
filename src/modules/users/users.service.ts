import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt'
import { CreateUserDto, UpdateUserDto } from './dto';
import { AppError } from 'src/common/constants/errors';
import { where } from 'sequelize';
@Injectable()
export class UsersService {
constructor(@InjectModel(User) private readonly UserRepository: typeof User){

}
async hashPassword(password){
return bcrypt.hash(password,10)
}

async findUserByEmail(email:string){
return this.UserRepository.findOne({where:{email}});
}
async createUser(dto: CreateUserDto):Promise<CreateUserDto>{



dto.password=await this.hashPassword(dto.password)
await this.UserRepository.create({
    firstName:dto.firstName,
    username:dto.username,
    password:dto.password,
    email:dto.email,
     } );
return dto;
}
async publicUser(email:string)
{return this.UserRepository.findOne({
    where: {email},
    attributes:{exclude :['password']}

})

}
async updateUser(email: string,dto: UpdateUserDto): Promise<UpdateUserDto>{
await this.UserRepository.update(dto,{where:{email}})
return dto;

}
async deleteUser(email: string){
    await this.UserRepository.destroy({where:{email}})
    return true;

}

}


