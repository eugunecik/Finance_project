import { ApiProperty } from "@nestjs/swagger";
import { Column, Model, Table, ForeignKey, BelongsTo, HasMany, DataType } from "sequelize-typescript";
import { User } from "./../../users/models/user.model";
import { ExpenseItem } from "./../../expense-items/models/expense-item.model";

@Table
export class Receipt extends Model {
  @ApiProperty({
    description: "Name of the merchant",
    example: "SuperStore",
  })
  @Column
  merchantName: string;

  @ApiProperty({
    description: "Total amount of the receipt",
    example: 99.99,
  })
  @Column(DataType.DECIMAL(10, 2))
  totalAmount: number;

  @ApiProperty({
    description: "Date of purchase",
    example: "2025-03-31T12:00:00Z",
  })
  @Column
  purchaseDate: Date;

  @ApiProperty({
    description: "URL of the receipt image",
    example: "https://example.com/receipt.jpg",
  })
  @Column
  imageUrl: string;

  @ApiProperty({
    description: "ID of the user who owns the receipt",
    example: 1,
  })
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ApiProperty({
    description: "User who owns the receipt",
    type: () => User,
  })
  @BelongsTo(() => User)
  user: User;

  @ApiProperty({
    description: "List of expense items associated with the receipt",
    type: () => [ExpenseItem],
  })
  @HasMany(() => ExpenseItem)
  expenseItems: ExpenseItem[];
}