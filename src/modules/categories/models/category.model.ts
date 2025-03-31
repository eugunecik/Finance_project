import { ApiProperty } from "@nestjs/swagger";
import { Column, Model, Table } from "sequelize-typescript";

@Table
export class Category extends Model {
  @ApiProperty({
    description: "Name of the category",
    example: "Food",
  })
  @Column
  name: string;
}