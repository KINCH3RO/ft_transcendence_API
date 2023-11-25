import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class AssignProductDto {
  @IsUUID()
  id: string;
}
