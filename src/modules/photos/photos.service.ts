import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Photo } from './models/photo.model';
import { AppError } from 'src/common/constants/errors';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PhotosService {
  constructor(
    @InjectModel(Photo) private readonly photoRepository: typeof Photo,
    private readonly configService: ConfigService,
  ) {}

  async createPhoto(
    file: Express.Multer.File,
    userId: number,
  ): Promise<Photo> {
    const baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
    
    const photo = await this.photoRepository.create({
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      url: `${baseUrl}/uploads/photos/${file.filename}`,
      userId,
    });

    return photo;
  }

  async getPhotoById(id: number): Promise<Photo> {
    const photo = await this.photoRepository.findOne({
      where: { id },
    });

    if (!photo) {
      throw new NotFoundException(AppError.NOT_FOUND_PHOTO || 'Photo not found');
    }

    return photo;
  }

  async getUserPhotos(userId: number): Promise<Photo[]> {
    return this.photoRepository.findAll({
      where: { userId },
    });
  }

  async deletePhoto(id: number, userId: number): Promise<{ message: string }> {
    const photo = await this.photoRepository.findOne({
      where: { id, userId },
    });

    if (!photo) {
      throw new NotFoundException(AppError.NOT_FOUND_PHOTO || 'Photo not found');
    }

    await photo.destroy();
    return { message: 'Photo successfully deleted' };
  }
}