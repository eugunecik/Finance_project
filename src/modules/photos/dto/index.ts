import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreatePhotoDto {
  @ApiProperty({
    description: "ID of the user who owns the photo",
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly userId: number;
}