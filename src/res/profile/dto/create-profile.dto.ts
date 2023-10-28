import { IsNumber } from 'class-validator';

export class CreateProfileDto {
  @IsNumber()
  rating: number;

  @IsNumber()
  level: number;

  @IsNumber()
  xp: number;

  @IsNumber()
  coins: number;
}
