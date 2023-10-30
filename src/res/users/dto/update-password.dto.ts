import { MinLength, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePasswordDto {
  @IsOptional()
  password?: string;

  @MinLength(8)
  newPassword: string;
}
