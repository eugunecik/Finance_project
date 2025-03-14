import { Column, Model, Table, ForeignKey, BelongsTo, HasMany, DataType } from 'sequelize-typescript';
import { User } from './../../users/models/user.model';
import { ExpenseItem } from './../../expense-items/models/expense-item.model';

@Table
export class Receipt extends Model {
  @Column
  merchantName: string;  

  @Column(DataType.DECIMAL(10, 2))
  totalAmount: number;

  @Column
  purchaseDate: Date;

  @Column
  imageUrl: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => ExpenseItem)
  expenseItems: ExpenseItem[];
}