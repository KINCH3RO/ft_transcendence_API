import { $Enums } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UpdateProductDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  category: $Enums.category;

  @IsOptional()
  @IsNotEmpty()
  selected: boolean;
}
