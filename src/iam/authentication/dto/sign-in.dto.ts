import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @MinLength(3)
  @MaxLength(60)
  username: string;

  @MinLength(8)
  password: string;
}
