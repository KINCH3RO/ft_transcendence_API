import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsUUID,
} from 'class-validator';
import { gameMode } from '../entities/match.entity';

export class CreateMatchDto {
  @IsNotEmpty()
  @IsUUID()
  winnerID: string;

  @IsNotEmpty()
  @IsUUID()
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
