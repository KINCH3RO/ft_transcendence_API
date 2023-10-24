import { IsOptional, MaxLength, MinLength, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  userName: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  fullName: string;

  @IsOptional()
  avatarUrl: string;

  @IsOptional()
  bannerUrl: string;
}
