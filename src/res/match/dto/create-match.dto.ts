import { IsBoolean, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { gameMode } from '../entities/match.entity';

export class CreateMatchDto {
  @IsNotEmpty()
  winnerID: string;

  @IsNotEmpty()
  loserID: string;

  @IsNumber()
  @IsNotEmpty()
  winnerScore: number;

  @IsNumber()
  @IsNotEmpty()
  loserScore: number;

  @IsEnum(gameMode)
  gameMode: string;

  @IsBoolean()
  ranked: boolean;
}
