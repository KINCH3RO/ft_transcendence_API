import { $Enums, friendStatus, user } from "@prisma/client";

export class FriendStatus implements friendStatus {
	senderID: string;
	receiverID: string;
	sender?: user;
	receiver?: user;

	isSender?: boolean
	friend?: user;
	state?: string

}
