import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Photo } from './models/photo.model';
import { AppError } from 'src/common/constants/errors';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PhotosService {
  constructor(
    @InjectModel(Photo) private readonly photoRepository: typeof Photo,
    private readonly configService: ConfigService,
  ) {}

  async createPhoto(file: Express.Multer.File, userId: number): Promise<Photo> {
    const uploadsPath = this.configService.get<string>('UPLOADS_PATH');
    if (!uploadsPath) {
      throw new Error('UPLOADS_PATH is not defined in configuration');
    }

    // Нормалізуємо шлях: замінюємо зворотні слеші на прямі
    const normalizedPath = file.path.replace(/\\/g, '/');
    const relativePath = `${uploadsPath}/${file.filename}`;

    const photo = await this.photoRepository.create({
      filename: file.filename,
      path: normalizedPath, // Зберігаємо нормалізований шлях
      mimetype: file.mimetype,
      url: relativePath, // Зберігаємо лише відносний шлях
      userId,
    });

    // Формуємо повний URL для повернення клієнту
    const baseUrl = this.configService.get<string>('BASE_URL');
    if (!baseUrl) {
      throw new Error('BASE_URL is not defined in configuration');
    }
    photo.setDataValue('url', `${baseUrl}${relativePath}`);

    return photo;
  }

  async getPhotoById(id: number): Promise<Photo> {
    const photo = await this.photoRepository.findOne({
      where: { id },
    });

    if (!photo) {
      throw new NotFoundException(AppError.NOT_FOUND_PHOTO);
    }

    // Додаємо повний URL для повернення клієнту
    const baseUrl = this.configService.get<string>('BASE_URL');
    if (!baseUrl) {
      throw new Error('BASE_URL is not defined in configuration');
    }
    photo.setDataValue('url', `${baseUrl}${photo.url}`);

    return photo;
  }

  async getUserPhotos(userId: number): Promise<Photo[]> {
    const photos = await this.photoRepository.findAll({
      where: { userId },
    });

    // Додаємо повний URL для кожного фото
    const baseUrl = this.configService.get<string>('BASE_URL');
    if (!baseUrl) {
      throw new Error('BASE_URL is not defined in configuration');
    }
    photos.forEach((photo) => {
      photo.setDataValue('url', `${baseUrl}${photo.url}`);
    });

    return photos;
  }

  async deletePhoto(id: number, userId: number): Promise<{ message: string }> {
    const photo = await this.photoRepository.findOne({
      where: { id, userId },
    });

    if (!photo) {
      throw new NotFoundException(AppError.NOT_FOUND_PHOTO);
    }

    await photo.destroy();
    return { message: 'Photo successfully deleted' };
  }

  private async convertToBase64(filePath: string, mimeType: string): Promise<{ base64: string, mimeType: string }> {
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`Photo file not found at ${filePath}`);
    }

    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString('base64');

    return {
      base64: base64Image,
      mimeType,
    };
  }

  async getPhotoAsBase64(photoId: number): Promise<{ base64: string, mimeType: string }> {
    const photo = await this.getPhotoById(photoId);
    return this.convertToBase64(photo.path, photo.mimetype);
  }

  async getPhotoAsBase64ByUrl(imageUrl: string): Promise<{ base64: string, mimeType: string }> {
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];

    const photo = await this.photoRepository.findOne({ where: { filename } });
    if (!photo) {
      const uploadsPath = this.configService.get<string>('UPLOADS_DIR');
      if (!uploadsPath) {
        throw new Error('UPLOADS_DIR is not defined in configuration');
      }
      const filePath = path.join(uploadsPath, filename).replace(/\\/g, '/');

      const fileExtension = path.extname(filename).toLowerCase();
      let mimeType = 'image/jpeg';
      if (fileExtension === '.png') mimeType = 'image/png';
      else if (fileExtension === '.gif') mimeType = 'image/gif';
      else if (fileExtension === '.webp') mimeType = 'image/webp';

      return this.convertToBase64(filePath, mimeType);
    }

    return this.convertToBase64(photo.path, photo.mimetype);
  }
}