import { friendRequests } from "@prisma/client";
import { UUID } from "crypto";

export class FriendRequest implements friendRequests {
	senderID: string;
	receiverID: string;
}
