import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @MinLength(3)
  @MaxLength(60)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  fullname: string;

  @MinLength(3)
  @MaxLength(60)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  username: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
