import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @MinLength(3)
  @MaxLength(20)
  fullname: string;

  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
