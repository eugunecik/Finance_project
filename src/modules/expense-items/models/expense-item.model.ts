import { Column, Model, Table, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { Receipt } from '../../receipts/models/receipt.model';
//import { Category } from '../../categories/models/category.model';

@Table
export class ExpenseItem extends Model {
  @Column
  name: string;

  @Column(DataType.DECIMAL(10, 2))
  amount: number;

  @ForeignKey(() => Receipt)
  @Column
  receiptId: number;

  @BelongsTo(() => Receipt)
  receipt: Receipt;

  //@ForeignKey(() => Category)
  //@Column
  //categoryId: number;

 // @BelongsTo(() => Category)
  //category: Category;
}