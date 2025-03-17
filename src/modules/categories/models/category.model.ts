import { Column, Model, Table, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';


@Table
export class Category extends Model {
  @Column
  name: string;

  

  
}