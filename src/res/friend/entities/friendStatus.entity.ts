import { $Enums, friendStatus, user } from "@prisma/client";
import { UUID } from "crypto";

export class FriendStatus implements friendStatus {
	senderID: string;
	receiverID: string;
	sender?: user;
	receiver?: user;

	isSender?: boolean
	friend?: user;

}
