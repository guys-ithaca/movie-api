import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  ValidateNested,
  IsOptional,
  IsEnum,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EnumPersonRelationType } from '../../common/EnumPersonRelationType';

class Person {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  id!: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @Type(() => String)
  name!: string;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsInt()
  @Type(() => Number)
  born!: number;

  @ApiProperty({
    required: false,
    enum: EnumPersonRelationType,
  })
  @IsEnum(EnumPersonRelationType)
  type?: keyof typeof EnumPersonRelationType | null;

  @ApiProperty({
    required: false,
    type: () => Number,
  })
  @IsInt()
  @Type(() => Number)
  rateCount?: number | null;
}
export { Person };
