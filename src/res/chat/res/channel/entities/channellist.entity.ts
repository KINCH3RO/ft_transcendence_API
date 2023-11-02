import { $Enums } from "@prisma/client";


class Attachment {
	id:        string;
	messageID: string;
	name:      string;
	url:       string;
	size:      number;
	mimeType:  string;
	type:      $Enums.fileType;
}

class User {
	id: string;
	userName: string;
	onlineStatus: boolean;
	avatarUrl: string;
}

class Message {
	senderID: string;
	content: string;
	attachment?: Attachment;
	createdAt: Date;
	updatedAt: Date;
}

class ChannelUser {
	userID: string;
	channelID: string;
	role: $Enums.channelRole;
	status: $Enums.channelStatus;
	duration: bigint;

	user?: User;
}

export class ChannelList {
	id: string;
	imageUrl: string;
	name: string;
	visibility: $Enums.channelVisibility;
	channels: ChannelUser[];
	message: Message[];

	reqByOwner?: boolean;
}
