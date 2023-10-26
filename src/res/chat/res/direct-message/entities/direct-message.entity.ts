import { directMessage, message, user } from "@prisma/client";

export class DirectMessage implements directMessage {
	id: string;
	senderID: string;
	receiverID: string;
	sender?: user;
	receiver?: user;
	message?: message;

	isSender?:boolean
	friend?:user;
}
