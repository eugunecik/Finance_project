import { Module } from '@nestjs/common';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Photo } from './models/photo.model';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    SequelizeModule.forFeature([Photo]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/photos',
        filename: (req, file, callback) => {
          const uniqueName = uuidv4();
          const extension = extname(file.originalname);
          callback(null, `${uniqueName}${extension}`);
        },
      }),
    }),
  ],
  controllers: [PhotosController],
  providers: [PhotosService],
  exports: [PhotosService],
})
export class PhotosModule {}