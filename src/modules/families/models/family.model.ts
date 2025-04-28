import { Column, Model, Table, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { ApiProperty } from '@nestjs/swagger';

@Table({
  tableName: 'families',
  timestamps: true,
})
export class Family extends Model {
  @ApiProperty({
    description: 'Family name',
    example: 'Smith Family',
  })
  @Column
  name: string;

  @ApiProperty({
    description: 'ID of the admin user',
    example: 1,
  })
  @ForeignKey(() => User)
  @Column
  adminId: number;

  @ApiProperty({
    description: 'Admin user of the family',
    type: () => User,
  })
  @BelongsTo(() => User, 'adminId')
  admin: User;

  @ApiProperty({
    description: 'List of user IDs who requested to join the family',
    example: [2, 3],
  })
  @Column({
    type: DataType.ARRAY(DataType.INTEGER),
    defaultValue: [],
  })
  joinRequests: number[];

  @ApiProperty({
    description: 'List of user IDs who are members of the family',
    example: [1, 4],
  })
  @Column({
    type: DataType.ARRAY(DataType.INTEGER),
    defaultValue: [],
  })
  members: number[];
}