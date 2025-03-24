import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNumber, IsDateString, IsOptional,IsUrl } from "class-validator"

export class CreateReceiptDTO {
  @ApiProperty()
  @IsString()
  merchantName: string;

  @ApiProperty()
  @IsNumber()
  totalAmount: number;

  @ApiProperty()
  @IsDateString()
  purchaseDate: Date;

  @ApiProperty()
  @IsString()
  imageUrl: string;
}
export class UpdateReceiptDTO {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  merchantName?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  purchaseDate?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
 
  imageUrl?: string;
}


export class CreateReceiptFromImageDTO {

  @IsString()

  imageUrl: string;
}