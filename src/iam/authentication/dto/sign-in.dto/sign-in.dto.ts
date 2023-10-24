import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @MinLength(10)
  password: string;
}
