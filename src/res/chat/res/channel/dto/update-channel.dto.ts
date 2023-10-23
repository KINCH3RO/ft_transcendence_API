import { PartialType } from '@nestjs/mapped-types';
import { CreateChannelDto } from './create-channel.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateChannelDto extends PartialType(CreateChannelDto) {
	@IsUUID()
	@IsOptional()
	id: string;
}
