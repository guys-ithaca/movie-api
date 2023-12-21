import { ApiProperty } from '@nestjs/swagger';
import { MovieCreateInput } from './MovieCreateInput';
import { Type } from 'class-transformer';

class CreateMovieArgs {
  @ApiProperty({
    required: false,
    type: () => MovieCreateInput,
  })
  @Type(() => MovieCreateInput)
  data!: MovieCreateInput;
}

export { CreateMovieArgs };
