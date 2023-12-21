import { ApiProperty } from '@nestjs/swagger';
import { MovieWhereInput } from './MovieWhereInput';
import { Type } from 'class-transformer';
import { MovieOrderByInput } from './MovieOrderByInput';
import { Int32 } from 'bson';

class MovieFindManyArgs {
  @ApiProperty({
    required: false,
    type: () => MovieWhereInput,
  })
  @Type(() => MovieWhereInput)
  where?: MovieWhereInput;

  @ApiProperty({
    required: false,
    type: [MovieOrderByInput],
  })
  @Type(() => MovieOrderByInput)
  orderBy?: Array<MovieOrderByInput>;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @Type(() => Int32)
  skip?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @Type(() => Int32)
  take?: number;
}

export { MovieFindManyArgs };
