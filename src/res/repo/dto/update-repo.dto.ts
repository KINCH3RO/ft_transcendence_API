import { PartialType } from '@nestjs/mapped-types';
import { CreateRepoDto } from './create-repo.dto';
import { IsNotEmpty, IsOptional, maxLength } from 'class-validator';

export class UpdateRepoDto {
  @IsNotEmpty()
	@IsOptional()
  selectedPaddle: string;

	@IsNotEmpty()
	@IsOptional()
	selectedMapSkin: string;
}
