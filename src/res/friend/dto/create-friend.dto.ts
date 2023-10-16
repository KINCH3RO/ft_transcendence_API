import { $Enums, friendStatus } from "@prisma/client";
import { IsUUID, isString, isUUID } from "class-validator";
import { UUID } from "crypto";


export class CreateFriendRequestDto {
	@IsUUID()
	senderID : string;
	@IsUUID()
	receiverID : string;
}

export class CreateFriendStatusDto {
	@IsUUID()
	senderID : string;
	@IsUUID()
	receiverID : string;

}
