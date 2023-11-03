import { IsNotEmpty, IsUUID, isUUID } from "class-validator";

export class LeaveChannelDto {
	@IsNotEmpty()
	@IsUUID()
	channelId: string;
}
