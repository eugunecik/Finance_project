import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateExpenseItemDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  receiptId: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
export class UpdateExpenseItemDTO {
  readonly name?: string;
  readonly amount?: number;
  readonly receiptId?: number;
  readonly categoryId?: number;
}