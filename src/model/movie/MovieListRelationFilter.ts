import { ApiProperty } from '@nestjs/swagger';
import { MovieWhereInput } from './MovieWhereInput';
import { ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class MovieListRelationFilter {
  @ApiProperty({
    required: false,
    type: () => MovieWhereInput,
  })
  @ValidateNested()
  @Type(() => MovieWhereInput)
  @IsOptional()
  every?: MovieWhereInput;

  @ApiProperty({
    required: false,
    type: () => MovieWhereInput,
  })
  @ValidateNested()
  @Type(() => MovieWhereInput)
  @IsOptional()
  some?: MovieWhereInput;

  @ApiProperty({
    required: false,
    type: () => MovieWhereInput,
  })
  @ValidateNested()
  @Type(() => MovieWhereInput)
  @IsOptional()
  none?: MovieWhereInput;
}
export { MovieListRelationFilter };
