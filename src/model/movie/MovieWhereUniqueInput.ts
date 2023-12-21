import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

class MovieWhereUniqueInput {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  id!: string;
}
export { MovieWhereUniqueInput };
