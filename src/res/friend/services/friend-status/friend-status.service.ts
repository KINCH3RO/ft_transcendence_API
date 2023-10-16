import { Injectable } from '@nestjs/common';
import { CreateFriendRequestDto, CreateFriendStatusDto } from '../../dto/create-friend.dto';
import { UpdateFriendStatusDto } from '../../dto/update-friend.dto';
import { FriendStatus } from '../../entities/friendStatus.entity';
import { UUID } from 'crypto';
import { FriendRequestService } from '../friend-request/friend-request.service';
import { FriendRequest } from '../../entities/friendRequest.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { friendStatus } from '@prisma/client';

@Injectable()
export class FriendStatusService {


	constructor(private prismaService: PrismaService, private friendRequestService: FriendRequestService) { }

	create(createFriendStatusDto: CreateFriendStatusDto): Promise<FriendStatus> {
		return this.prismaService.friendStatus.create({ data: createFriendStatusDto })
	}

	findAll(): Promise<FriendStatus[]> {
		return this.prismaService.friendStatus.findMany();
	}

	findOne(id: UUID) {
		return this.prismaService.friendStatus.findFirst({
			where: {
				OR: [
					{ receiverID: id },
					{ senderID: id }
				]
			}
		})
	}

	update(updatefriendStatusDto: UpdateFriendStatusDto): Promise<{ count }> {
		return this.prismaService.friendStatus.updateMany({
			data: updatefriendStatusDto,
			where: {
				OR: [
					{ senderID: updatefriendStatusDto.receiverID, receiverID: updatefriendStatusDto.receiverID },
					{ receiverID: updatefriendStatusDto.receiverID, senderID: updatefriendStatusDto.receiverID }
				]
			}
		})
	}

	remove(senderID: UUID, receiverID: UUID): Promise<{ count }> {
		return this.prismaService.friendStatus.deleteMany({
			where: {
				OR: [
					{ senderID: senderID, receiverID: receiverID },
					{ receiverID: senderID, senderID: receiverID }
				]
			}
		})
	}




	getFriendsList(userId: UUID): Promise<friendStatus[]> {
		return this.prismaService.friendStatus.findMany({
			where: {
				OR:
					[
						{ senderID: userId },
						{ receiverID: userId },
					]
			}
		})
	}

}
