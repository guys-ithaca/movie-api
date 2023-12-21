import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateNested, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { Review } from './Review';

class MovieUpdateInput {
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
  title!: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @Type(() => String)
  tagLine!: string;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsInt()
  @Type(() => Number)
  release!: number;

  @ApiProperty({
    required: false,
    type: () => [String],
  })
  @ValidateNested()
  @Type(() => String)
  @IsOptional()
  tags?: string[] | null;

  @ApiProperty({
    required: false,
    type: () => Review,
  })
  @ValidateNested()
  @Type(() => Review)
  review?: Review;
}
export { MovieUpdateInput };
