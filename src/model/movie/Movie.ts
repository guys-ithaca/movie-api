import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateNested, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
class Movie {
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
}
export { Movie };
