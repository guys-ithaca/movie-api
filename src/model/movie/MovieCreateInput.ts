import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { Person } from './person/Person';
import { CreatePerson } from './person/CreatePerson';

class MovieCreateInput {
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
    required: true,
    type: () => [CreatePerson],
  })
  @ValidateNested()
  @Type(() => CreatePerson)
  actors!: Array<CreatePerson>;

  @ApiProperty({
    required: true,
    type: () => [CreatePerson],
  })
  @ValidateNested()
  @Type(() => CreatePerson)
  directors!: Array<CreatePerson>;
}
export { MovieCreateInput };
