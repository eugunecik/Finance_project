import { Column, Model, Table, HasMany } from 'sequelize-typescript';
import { Receipt } from '../../receipts/models/receipt.model';

@Table
export class User extends Model {
  @Column
  firstName: string;

  @Column
  username: string;

  @Column
  email: string;

  @Column
  password: string;

  @HasMany(() => Receipt)
  receipts: Receipt[];
}