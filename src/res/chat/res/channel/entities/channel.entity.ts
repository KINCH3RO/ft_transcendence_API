import { $Enums, channel, channelUser, message } from "@prisma/client";

export class Message implements message {
	id: string;
	senderID: string;
	directmessageID: string;
	channelID: string;
	content: string;
}

export class ChannelUser implements channelUser {
	userID: string;
	channelID: string;
	role: $Enums.channelRole;
	status: $Enums.channelStatus;
	duration: bigint;
}

export class Channel implements channel {
	id: string;
	imageUrl: string;
	name: string;
	password: string;
	visibility: $Enums.channelVisibility;
	channels: ChannelUser[];
	message: Message[];
}
