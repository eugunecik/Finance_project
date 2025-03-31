import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateReceiptDTO {
  @ApiProperty({
    description: "Name of the merchant",
    example: "SuperStore",
  })
  @IsString()
  merchantName: string;

  @ApiProperty({
    description: "Total amount of the receipt",
    example: 99.99,
  })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({
    description: "Date of purchase",
    example: "2025-03-31T12:00:00Z",
  })
  @IsDateString()
  purchaseDate: Date;

  @ApiProperty({
    description: "URL of the receipt image",
    example: "https://example.com/receipt.jpg",
  })
  @IsString()

  imageUrl: string;
}

export class UpdateReceiptDTO {
  @ApiProperty({
    description: "Name of the merchant",
    example: "SuperStore",
    required: false,
  })
  @IsString()
  @IsOptional()
  merchantName?: string;

  @ApiProperty({
    description: "Total amount of the receipt",
    example: 99.99,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @ApiProperty({
    description: "Date of purchase",
    example: "2025-03-31T12:00:00Z",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  purchaseDate?: Date;

  @ApiProperty({
    description: "URL of the receipt image",
    example: "https://example.com/receipt.jpg",
    required: false,
  })
  @IsString()
 
  @IsOptional()
  imageUrl?: string;
}

export class CreateReceiptFromImageDTO {
  @ApiProperty({
    description: "URL of the image to create a receipt from",
    example: "https://example.com/receipt.jpg",
  })
  @IsString()

  imageUrl: string;
}