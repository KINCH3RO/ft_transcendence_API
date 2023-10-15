import { $Enums, friendStatus } from "@prisma/client";

export class FriendStatus implements friendStatus {
	senderID: string;
	receiverID: string;
	blockStatus: $Enums.actionStatus;
	muteStatus: $Enums.actionStatus;

}
