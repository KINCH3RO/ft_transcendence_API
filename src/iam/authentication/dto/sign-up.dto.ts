import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @MinLength(3)
  @MaxLength(60)
  fullname: string;

  @MinLength(3)
  @MaxLength(60)
  username: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
