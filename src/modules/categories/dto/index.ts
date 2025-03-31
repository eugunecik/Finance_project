import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDTO {
  @ApiProperty({
    description: "Name of the category",
    example: "Food",
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}

export class UpdateCategoryDTO {
  @ApiProperty({
    description: "Name of the category",
    example: "Food",
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly name?: string;
}