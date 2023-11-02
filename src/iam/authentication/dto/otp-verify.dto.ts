import { IsNotEmpty } from 'class-validator';

export class OtpVerifyDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  code: string;
}
