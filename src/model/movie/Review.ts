import { ApiProperty } from '@nestjs/swagger';
import { IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Person } from './person/Person';
class Review {
  @ApiProperty({
    required: true,
    type: () => Person,
  })
  @ValidateNested()
  @Type(() => Person)
  reviewBy!: Person;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsInt()
  @Type(() => Number)
  rating!: number;
}
export { Review };
