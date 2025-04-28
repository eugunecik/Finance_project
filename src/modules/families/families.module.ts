import { Module } from '@nestjs/common';
import { FamiliesController } from './families.controller';
import { FamiliesService } from './families.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Family } from './models/family.model';
import { User } from '../users/models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Family, User]),
  ],
  controllers: [FamiliesController],
  providers: [FamiliesService],
})
export class FamiliesModule {}