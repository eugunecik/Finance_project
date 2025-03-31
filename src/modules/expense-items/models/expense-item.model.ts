import { ApiProperty } from "@nestjs/swagger";
import { Column, Model, Table, ForeignKey, BelongsTo, DataType } from "sequelize-typescript";
import { Receipt } from "../../receipts/models/receipt.model";
import { Category } from "../../categories/models/category.model";

@Table
export class ExpenseItem extends Model {
  @ApiProperty({
    description: "Name of the expense item",
    example: "Groceries",
  })
  @Column
  name: string;

  @ApiProperty({
    description: "Amount spent on the expense item",
    example: 45.99,
  })
  @Column(DataType.DECIMAL(10, 2))
  amount: number;

  @ApiProperty({
    description: "ID of the associated receipt",
    example: 1,
  })
  @ForeignKey(() => Receipt)
  @Column
  receiptId: number;

  @ApiProperty({
    description: "Associated receipt",
    type: () => Receipt,
  })
  @BelongsTo(() => Receipt)
  receipt: Receipt;

  @ApiProperty({
    description: "ID of the associated category",
    example: 2,
  })
  @ForeignKey(() => Category)
  @Column
  categoryId: number;

  @ApiProperty({
    description: "Associated category",
    type: () => Category,
  })
  @BelongsTo(() => Category)
  category: Category;
}