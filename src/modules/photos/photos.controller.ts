import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiParam,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { PhotosService } from "./photos.service";
import { JwtAuthGuard } from "src/guards/jwt-guard";
import { Photo } from "./models/photo.model";

@ApiTags("Photos")
@Controller("photos")
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post("upload")
  @UseInterceptors(FileInterceptor("photo"))
  @ApiOperation({ summary: "Upload a new photo" })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: 201, description: "Photo uploaded successfully", type: Photo })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<Photo> {
    const userId = req.user?.userId;
    return this.photosService.createPhoto(file, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get("my")
  @ApiOperation({ summary: "Get all photos of the authenticated user" })
  @ApiResponse({ status: 200, description: "List of user photos", type: [Photo] })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getMyPhotos(@Request() req): Promise<Photo[]> {
    const userId = req.user?.userId;
    return this.photosService.getUserPhotos(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get(":id")
  @ApiOperation({ summary: "Get a photo by ID" })
  @ApiParam({ name: "id", description: "Photo ID", example: 1 })
  @ApiResponse({ status: 200, description: "Photo found", type: Photo })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Photo not found" })
  async getPhotoById(@Param("id") id: number): Promise<Photo> {
    return this.photosService.getPhotoById(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(":id")
  @ApiOperation({ summary: "Delete a photo by ID" })
  @ApiParam({ name: "id", description: "Photo ID", example: 1 })
  @ApiResponse({ status: 200, description: "Photo deleted successfully", type: Object })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Photo not found" })
  async deletePhoto(@Param("id") id: number, @Request() req): Promise<{ message: string }> {
    const userId = req.user?.userId;
    return this.photosService.deletePhoto(id, userId);
  }
}