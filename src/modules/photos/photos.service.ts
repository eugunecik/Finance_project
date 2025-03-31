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

  async createPhoto(
    file: Express.Multer.File,
    userId: number,
  ): Promise<Photo> {
    const baseUrl = this.configService.get<string>('BASE_URL');
    
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
      throw new NotFoundException(AppError.NOT_FOUND_PHOTO );
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
      throw new NotFoundException(AppError.NOT_FOUND_PHOTO );
    }

    await photo.destroy();
    return { message: 'Photo successfully deleted' };
  }

  async getPhotoAsBase64(photoId: number): Promise<{ base64: string, mimeType: string }> {
    const photo = await this.getPhotoById(photoId);
    
    
    const filePath = photo.path;
    
    
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`Photo file not found at ${filePath}`);
    }
    
    
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString('base64');
    
    return {
      base64: base64Image,
      mimeType: photo.mimetype
    };
  }

  async getPhotoAsBase64ByUrl(imageUrl: string): Promise<{ base64: string, mimeType: string }> {
    
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    
   
    const photo = await this.photoRepository.findOne({
      where: { filename }
    });
    
    if (!photo) {
      
      const uploadsPath = path.join(process.cwd(), 'uploads', 'photos');
      const filePath = path.join(uploadsPath, filename);
      
      if (!fs.existsSync(filePath)) {
        throw new NotFoundException(`Photo file not found: ${filename}`);
      }
      
      
      const fileExtension = path.extname(filename).toLowerCase();
      let mimeType = 'image/jpeg'; 
      
      if (fileExtension === '.png') {
        mimeType = 'image/png';
      } else if (fileExtension === '.gif') {
        mimeType = 'image/gif';
      } else if (fileExtension === '.webp') {
        mimeType = 'image/webp';
      }
      
     
      const imageBuffer = fs.readFileSync(filePath);
      const base64Image = imageBuffer.toString('base64');
      
      return {
        base64: base64Image,
        mimeType: mimeType
      };
    }
    
    
    const filePath = photo.path;
    
   
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`Photo file not found at ${filePath}`);
    }
    
   
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString('base64');
    
    return {
      base64: base64Image,
      mimeType: photo.mimetype
    };
  }
}