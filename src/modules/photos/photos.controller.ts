import {Controller,Post,UseInterceptors,UploadedFile,Get,Param,Delete,UseGuards,Request,} from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { PhotosService } from './photos.service';
  import { JwtAuthGuard } from 'src/guards/jwt-guard';
  import { Photo } from './models/photo.model';
  
  @Controller('photos')
  export class PhotosController {
    constructor(private readonly photosService: PhotosService) {}
  
    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('photo'))
    async uploadPhoto(
      @UploadedFile() file: Express.Multer.File,
      @Request() req,
    ): Promise<Photo> {
      const userId = req.user?.userId;
      return this.photosService.createPhoto(file, userId);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get('my')
    async getMyPhotos(@Request() req): Promise<Photo[]> {
      const userId = req.user?.userId;
      return this.photosService.getUserPhotos(userId);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getPhotoById(@Param('id') id: number): Promise<Photo> {
      return this.photosService.getPhotoById(id);
    }
  
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deletePhoto(
      @Param('id') id: number,
      @Request() req,
    ): Promise<{ message: string }> {
      const userId = req.user?.userId;
      return this.photosService.deletePhoto(id, userId);
    }
  }