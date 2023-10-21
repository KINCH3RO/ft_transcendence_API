import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { gameMode } from 'src/res/match/entities/match.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsUUID()
  winnerID: string;

  @IsOptional()
  @IsUUID()
  loserID: string;

  @IsOptional()
  @IsNumber()
  winnerScore: number;

  @IsOptional()
  @IsNumber()
  loserScore: number;

  @IsOptional()
  @IsEnum(gameMode)
  gameMode: string;

  @IsOptional()
  @IsBoolean()
  ranked: boolean;
}
