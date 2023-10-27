import { Injectable } from '@nestjs/common';
import { directMessage } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DirectMessage } from './entities/direct-message.entity';

import { WebSocketService } from 'src/res/web-socket/web-socket.service';

@Injectable()
export class DirectMessageService {
	constructor(
		private prisma: PrismaService,
		private webSocketService: WebSocketService,
	) { }

	create(senderId: string, receiverId: string) {
		return this.prisma.directMessage.create({
			data: {
				receiverID: receiverId,
				senderID: senderId,
				message: {},
			},
		});
	}

	findYourDM(senderId: string) {
		return this.prisma.directMessage.findMany({
			where: { senderID: senderId },
		});
	}

	remove(DmId: string) {
		return this.prisma.directMessage.delete({ where: { id: DmId } });
	}

	// findDMByReciverName

	async listCurrentDM(userID: string) {
		const dms: directMessage[] = await this.prisma.directMessage.findMany({
			include: {
				sender: {
					select: {
						avatarUrl: true,
						userName: true,
						id: true,
						onlineStatus: true,
						fullName: true,
					},
				},
				receiver: {
					select: {
						avatarUrl: true,
						userName: true,
						id: true,
						onlineStatus: true,
						fullName: true,
					},
				},
				message: {
					take: 1,
					orderBy: {
						createdAt: 'desc',
					},
					select: {
						senderID: true,
						content: true,
						attachment: true,
						createdAt: true,
						updatedAt: true
					},
				},
			},
			where: {
				OR: [{ senderID: userID }, { receiverID: userID }],
			},
		});

		return dms.map((data: DirectMessage) => {
			let baseData: DirectMessage = {
				id: data.id,
				receiverID: data.receiverID,
				senderID: data.senderID,
			};

			if (userID != data.receiverID) baseData['friend'] = data.receiver;
			if (userID != data.senderID) baseData['friend'] = data.sender;
			baseData['isSender'] = userID == data.senderID;
			baseData['friend'].onlineStatus = this.webSocketService.isOnline(
				baseData['friend'].id,
			);
			baseData['message'] = data.message[0];

			return baseData;
		});
	}
}
