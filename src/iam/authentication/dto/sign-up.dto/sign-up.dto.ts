import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  fullname: string;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsEmail()
  email: string;

  @MinLength(10)
  password: string;
}
