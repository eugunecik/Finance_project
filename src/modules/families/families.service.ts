import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Family } from './models/family.model';
import { User } from '../users/models/user.model';
import { CreateFamilyDto, RequestJoinFamilyDto, ManageJoinRequestDto, FamilyJoinRequestStatusDto } from './dto';
import { AppError } from 'src/common/constants/errors';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectModel(Family) private readonly familyRepository: typeof Family,
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  async createFamily(dto: CreateFamilyDto, userId: number): Promise<Family> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(AppError.USER_NOT_EXIST);
    }
    if (user.familyId) {
      throw new BadRequestException(AppError.USER_ALREADY_IN_FAMILY);
    }

    const family = await this.familyRepository.create({
      name: dto.name,
      adminId: userId,
      members: [userId],
    });

    await user.update({ familyId: family.id });
    return family;
  }

  async requestJoinFamily(dto: RequestJoinFamilyDto, userId: number): Promise<Family> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(AppError.USER_NOT_EXIST);
    }
    if (user.familyId) {
      throw new BadRequestException(AppError.USER_ALREADY_IN_FAMILY);
    }

    const family = await this.familyRepository.findOne({ where: { id: dto.familyId } });
    if (!family) {
      throw new NotFoundException(AppError.FAMILY_NOT_FOUND);
    }
    if (family.joinRequests.includes(userId)) {
      throw new BadRequestException(AppError.JOIN_REQUEST_ALREADY_SENT);
    }

    await family.update({
      joinRequests: [...family.joinRequests, userId],
    });

    return family;
  }

  async manageJoinRequest(dto: ManageJoinRequestDto, userId: number): Promise<Family> {
    const family = await this.familyRepository.findOne({
      where: { adminId: userId },
    });
    if (!family) {
      throw new NotFoundException(AppError.FAMILY_NOT_FOUND_OR_NOT_ADMIN);
    }

    const requestingUser = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!requestingUser) {
      throw new NotFoundException(AppError.USER_NOT_EXIST);
    }
    if (!family.joinRequests.includes(dto.userId)) {
      throw new BadRequestException(AppError.NO_JOIN_REQUEST);
    }

    if (dto.accept) {
      if (requestingUser.familyId) {
        throw new BadRequestException(AppError.USER_ALREADY_IN_FAMILY);
      }
      await family.update({
        members: [...family.members, dto.userId],
        joinRequests: family.joinRequests.filter((id) => id !== dto.userId),
      });
      await requestingUser.update({ familyId: family.id });
    } else {
      await family.update({
        joinRequests: family.joinRequests.filter((id) => id !== dto.userId),
      });
    }

    return family;
  }

  async getFamilyById(familyId: number, userId: number): Promise<Family> {
    const family = await this.familyRepository.findOne({
      where: { id: familyId },
      include: [{ model: User, as: 'admin' }],
    });
    if (!family || (!family.members.includes(userId) && family.adminId !== userId)) {
      throw new NotFoundException(AppError.FAMILY_NOT_FOUND_OR_NOT_MEMBER);
    }
    return family;
  }

  async getUserFamily(userId: number): Promise<Family | null> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.familyId) {
      return null;
    }
    return this.getFamilyById(user.familyId, userId);
  }

  async getPendingJoinRequests(userId: number): Promise<User[]> {
    const family = await this.familyRepository.findOne({
      where: { adminId: userId },
    });
    if (!family) {
      throw new NotFoundException(AppError.FAMILY_NOT_FOUND_OR_NOT_ADMIN);
    }

    if (!family.joinRequests || family.joinRequests.length === 0) {
      return [];
    }

    return this.userRepository.findAll({
      where: { id: family.joinRequests },
      attributes: ['id', 'firstName', 'username', 'email'],
    });
  }

  async getMyJoinRequests(userId: number): Promise<FamilyJoinRequestStatusDto[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(AppError.USER_NOT_EXIST);
    }

    const families = await this.familyRepository.findAll();

    const joinRequests: FamilyJoinRequestStatusDto[] = [];
    for (const family of families) {
      if (family.joinRequests.includes(userId)) {
        joinRequests.push({
          familyId: family.id,
          familyName: family.name,
          status: 'pending',
        });
      } else if (family.members.includes(userId)) {
        joinRequests.push({
          familyId: family.id,
          familyName: family.name,
          status: 'accepted',
        });
      }
    }

    return joinRequests;
  }

  async getFamilyByIdForAll(familyId: number): Promise<Family> {
    const family = await this.familyRepository.findOne({
      where: { id: familyId },
      include: [{ model: User, as: 'admin' }],
    });
    if (!family) {
      throw new NotFoundException(AppError.FAMILY_NOT_FOUND);
    }
    return family;
  }
}