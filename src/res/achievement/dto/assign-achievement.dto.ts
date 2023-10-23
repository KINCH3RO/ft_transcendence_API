import { IsNumber, IsOptional } from 'class-validator';

export class AssignAchievementDto {
  @IsNumber()
  id: number;

  @IsOptional()
  name: string;
}
