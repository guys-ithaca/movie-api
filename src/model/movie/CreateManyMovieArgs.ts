import { Type } from 'class-transformer';
import { MovieCreateInput } from './MovieCreateInput';
import { ApiProperty } from '@nestjs/swagger';

class CreateManyMovieArgs {
  @ApiProperty({
    required: false,
    type: [MovieCreateInput],
  })
  @Type(() => MovieCreateInput)
  data?: Array<MovieCreateInput>;
}

export { CreateManyMovieArgs };
