import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.dto';
import { $Enums, channel } from '@prisma/client';

export class UpdateMessageDto implements channel {
	id: string;
	imageUrl: string;
	name: string;
	password: string;
	visibility: $Enums.channelVisibility;
}
