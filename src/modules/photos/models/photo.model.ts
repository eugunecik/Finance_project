import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table, BelongsTo, ForeignKey } from "sequelize-typescript";
import { User } from "../../users/models/user.model";

@Table({ tableName: "photos" })
export class Photo extends Model {
  @ApiProperty({
    description: "Unique identifier of the photo",
    example: 1,
  })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({
    description: "Name of the photo file",
    example: "photo123.jpg",
  })
  @Column({ type: DataType.STRING, allowNull: false })
  filename: string;

  @ApiProperty({
    description: "File system path to the photo",
    example: "/uploads/photo123.jpg",
  })
  @Column({ type: DataType.STRING, allowNull: false })
  path: string;

  @ApiProperty({
    description: "MIME type of the photo",
    example: "image/jpeg",
  })
  @Column({ type: DataType.STRING, allowNull: false })
  mimetype: string;

  @ApiProperty({
    description: "Public URL of the photo",
    example: "https://example.com/uploads/photo123.jpg",
  })
  @Column({ type: DataType.STRING })
  url: string;

  @ApiProperty({
    description: "ID of the user who owns the photo",
    example: 1,
  })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @ApiProperty({
    description: "User who owns the photo",
    type: () => User,
  })
  @BelongsTo(() => User)
  user: User;
}