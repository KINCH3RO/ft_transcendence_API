import { friendRequests, friendStatus, user } from '@prisma/client';

export class User implements user {
	id: string;
	state: string;
	userName: string;
	email: string;
	fullName: string;
	password: string;
	verifiedAt: Date;
	onlineStatus: boolean;
	avatarUrl: string;
	bannerUrl: string;
	createdAt: Date;
	updatedAt: Date;
	profileID: string;
	twoFactorAuthEnabled: boolean;
	twoFactorAuthSecret: string;
	sentRequests?: friendStatus[];
	receivedRequests?: friendRequests[];
	sentFriends?: friendRequests[];
	receiveFriends?: friendRequests[];
	repoID: string;
}
