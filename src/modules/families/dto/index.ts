import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsBoolean } from 'class-validator';

export class CreateFamilyDto {
  @ApiProperty({
    description: 'Name of the family',
    example: 'Smith Family',
  })
  @IsString()
  name: string;
}

export class RequestJoinFamilyDto {
  @ApiProperty({
    description: 'ID of the family to join',
    example: 1,
  })
  @IsInt()
  familyId: number;
}

export class ManageJoinRequestDto {
  @ApiProperty({
    description: 'ID of the user requesting to join',
    example: 2,
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'Whether to accept or reject the request',
    example: true,
  })
  @IsBoolean()
  accept: boolean;
}

export class FamilyJoinRequestStatusDto {
  @ApiProperty({
    description: 'ID of the family',
    example: 1,
  })
  @IsInt()
  familyId: number;

  @ApiProperty({
    description: 'Name of the family',
    example: 'Smith Family',
  })
  @IsString()
  familyName: string;

  @ApiProperty({
    description: 'Status of the join request',
    example: 'pending',
    enum: ['pending', 'accepted', 'rejected'],
  })
  @IsString()
  status: 'pending' | 'accepted' | 'rejected';
}