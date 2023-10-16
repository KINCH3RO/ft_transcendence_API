import { $Enums, friendStatus } from "@prisma/client";
import { UUID } from "crypto";

export class FriendStatus implements friendStatus {
	senderID: string ;
	receiverID: string ;
	blockStatus: $Enums.actionStatus;
	muteStatus: $Enums.actionStatus;

}
