import { $Enums, friendStatus } from "@prisma/client";
import { IsUUID, isString, isUUID } from "class-validator";
import { UUID } from "crypto";


export class CreateFriendRequestDto {
	@IsUUID()
	senderID: UUID;
	@IsUUID()
	receiverID: UUID;
}

export class CreateFriendStatusDto {
	@IsUUID()
	senderID: UUID;
	@IsUUID()
	receiverID: UUID;

}
