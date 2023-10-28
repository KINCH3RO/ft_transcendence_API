import { $Enums, directMessage, message, user } from "@prisma/client";

export class DirectMessage implements directMessage {
	blockStatus: $Enums.actionStatus;
	muteStatus: $Enums.actionStatus;
	id: string;
	senderID: string;
	receiverID: string;
	sender?: user;
	receiver?: user;
	message?: message;

	isSender?: boolean
	friend?: user;
}
