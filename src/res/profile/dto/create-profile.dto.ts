import { IsNumber, IsUUID } from 'class-validator';

export class CreateProfileDto {
  @IsUUID()
  id: string;

  @IsNumber()
  rating: number;

  @IsNumber()
  level: number;

  @IsNumber()
  xp: number;

  @IsNumber()
  coins: number;
}
