import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

class CreatePerson {
  @ApiProperty({
    required: true,
    type: () => String,
  })
  @Type(() => String)
  name!: string;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsInt()
  @Type(() => Number)
  born!: number;
}
export { CreatePerson };
