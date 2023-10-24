import { MinLength, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  password: string;

  @MinLength(8)
  newPassword: string;
}
