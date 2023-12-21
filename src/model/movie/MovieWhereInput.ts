import { ApiProperty } from '@nestjs/swagger';
import { StringFilter } from '../util/StringFilter';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

class MovieWhereInput {
  @ApiProperty({
    required: false,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  @IsOptional()
  description?: StringFilter;

  @ApiProperty({
    required: false,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  @IsOptional()
  id?: StringFilter;

  @ApiProperty({
    required: false,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  @IsOptional()
  name?: StringFilter;

  @ApiProperty({
    required: false,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  @IsOptional()
  recommendationByPersonId?: StringFilter;
}
export { MovieWhereInput };
