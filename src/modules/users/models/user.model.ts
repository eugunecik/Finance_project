import { Column, Model, Table, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Receipt } from '../../receipts/models/receipt.model';
import { Family } from '../../families/models/family.model';
import { ApiProperty } from '@nestjs/swagger';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
  @ApiProperty({
    description: 'User\'s first name',
    example: 'John',
  })
  @Column
  firstName: string;

  @ApiProperty({
    description: 'User\'s username',
    example: 'john2024',
  })
  @Column
  username: string;

  @ApiProperty({
    description: 'User\'s email address',
    example: 'john@example.com',
  })
  @Column
  email: string;

  @ApiProperty({
    description: 'User\'s password (hashed)',
    example: '$2b$10$w9mk5Cc0oqaZZ1kEkQ5koeEo3lJAXn0gMv5yCUMFo6.5n5HWAsMJm',
  })
  @Column
  password: string;

  @ApiProperty({
    description: 'ID of the family the user belongs to',
    example: 1,
    nullable: true,
  })
  @ForeignKey(() => Family)
  @Column
  familyId: number;

  @ApiProperty({
    description: 'User\'s family',
    type: () => Family,
    nullable: true,
  })
  @BelongsTo(() => Family)
  family: Family;

  @ApiProperty({
    description: 'User\'s receipts',
    type: [Receipt],
  })
  @HasMany(() => Receipt)
  receipts: Receipt[];
}