import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsOptional } from "class-validator";

export class CreateExpenseItemDTO {
  @ApiProperty({
    description: "Name of the expense item",
    example: "Groceries",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "Amount spent on the expense item",
    example: 45.99,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: "ID of the associated receipt",
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  receiptId: number;

  @ApiProperty({
    description: "ID of the associated category (optional)",
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}

export class UpdateExpenseItemDTO {
  @ApiProperty({
    description: "Name of the expense item",
    example: "Groceries",
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: "Amount spent on the expense item",
    example: 45.99,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({
    description: "ID of the associated receipt",
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  receiptId?: number;

  @ApiProperty({
    description: "ID of the associated category",
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}