import { $Enums, channel, channelUser, message } from "@prisma/client";

export class Message implements message {
	id: number;
	senderID: string;
	directmessageID: number;
	channelID: string;
	content: string;
}

export class ChannelUser implements channelUser {
	userID: string;
	channelID: string;
	role: $Enums.channelRole;
	status: $Enums.channelStatus;
}

export class Channel implements channel {
	id: string;
	imageUrl: string;
	name: string;
	password: string;
	visibility: $Enums.channelVisibility;
	channels: channelUser[];
	message: Message[];
}
