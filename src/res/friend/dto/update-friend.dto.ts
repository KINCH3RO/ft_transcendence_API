import { PartialType } from '@nestjs/mapped-types';
import { CreateFriendRequestDto, CreateFriendStatusDto } from './create-friend.dto';
import { $Enums } from '@prisma/client';
import { isString } from 'class-validator';

export class UpdateFriendRequestDto extends PartialType(CreateFriendRequestDto) { }
export class UpdateFriendStatusDto extends PartialType(CreateFriendStatusDto) {

	blockStatus?: $Enums.actionStatus;
	muteStatus?: $Enums.actionStatus;
}
