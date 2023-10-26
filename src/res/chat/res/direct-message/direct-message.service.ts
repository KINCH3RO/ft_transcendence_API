import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DirectMessageService {

	constructor(private prisma: PrismaService) { }

	create(senderId: string, receiverId: string) {
		return this.prisma.directMessage.create({
			data: {
				receiverID: receiverId,
				senderID: senderId,
				message: {}
			}
		})
	}

	findYourDM(senderId: string) {
		return this.prisma.directMessage.findMany({ where: { senderID: senderId } });
	}

	remove(DmId: string) {
		return this.prisma.directMessage.delete({ where: { id: DmId } });
	}

	// findDMByReciverName
}
