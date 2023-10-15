import { friendRequests } from "@prisma/client";

export class FriendRequest implements friendRequests {
	senderID: string;
	receiverID: string;
}
