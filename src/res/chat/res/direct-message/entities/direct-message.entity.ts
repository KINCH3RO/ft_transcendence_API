import { $Enums, directMessage, message, user } from "@prisma/client";
import { User } from "src/res/users/entities/user.entity";

export class DirectMessage implements directMessage {
	blockStatus: $Enums.actionStatus;
	muteStatus: $Enums.actionStatus;
	id: string;
	senderID: string;
	receiverID: string;
	sender?: User;
	receiver?: User;
	message?: message;

	isSender?: boolean
	friend?: User;
}
