import { PartialType } from '@nestjs/mapped-types';
import { CreateChannelDto } from './create-channel.dto';
import { IsNotEmpty, IsOptional, IsUUID, IsUrl, MinLength } from 'class-validator';

export class UpdateChannelDto {
	@IsUUID()
	@IsOptional()
	id: string;

	@IsNotEmpty()
	@IsOptional()
	imageUrl: string;

	@IsNotEmpty()
	@IsOptional()
	name: string;
}
