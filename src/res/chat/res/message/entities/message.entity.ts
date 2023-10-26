import { message } from "@prisma/client";
import { User } from "src/res/users/entities/user.entity";

export class Message implements message {
	id: string;
	senderID: string;
	directmessageID: string;
	channelID: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	mine?: boolean

}
