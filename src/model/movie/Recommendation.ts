import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Person } from './person/Person';
import { Movie } from './Movie';

class Recommendation {
  @ApiProperty({
    required: true,
    type: () => [Movie],
  })
  @ValidateNested()
  @Type(() => Movie)
  movies!: Array<Movie>;

  @ApiProperty({
    required: true,
    type: () => [Person],
  })
  @ValidateNested()
  @Type(() => Person)
  connections!: Array<Person>;
}
export { Recommendation };
