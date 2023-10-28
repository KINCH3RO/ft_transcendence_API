import { $Enums } from "@prisma/client";
import { IsOptional, IsUUID } from "class-validator";


export class UpdateDirectMessageDto {

	@IsUUID()
	senderID: string;
	@IsUUID()
	receiverID: string;
	@IsOptional()
	blockStatus?: $Enums.actionStatus;
	@IsOptional()
	muteStatus?: $Enums.actionStatus;
}
