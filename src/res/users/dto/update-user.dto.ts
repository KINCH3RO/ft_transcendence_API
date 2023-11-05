import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional, MaxLength, MinLength, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(3)
  @MaxLength(60)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  userName: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @MinLength(3)
  @MaxLength(60)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  fullName: string;

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  avatarUrl: string;

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  bannerUrl: string;
}
