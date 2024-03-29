import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFriendRequestDb } from '../../dto/create-friend.dto';
import { UpdateFriendRequestDto } from '../../dto/update-friend.dto';
import { FriendRequest } from '../../entities/friendRequest.entity';
import { friendRequests, friendStatus } from '@prisma/client';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendStatus } from '../../entities/friendStatus.entity';
import { WsException } from '@nestjs/websockets';
import { FriendStatusService } from '../friend-status/friend-status.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
@Injectable()
export class FriendRequestService {
  constructor(
    private prismaService: PrismaService,
    private friendStatusService: FriendStatusService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    createFriendRequestDb: CreateFriendRequestDb,
  ): Promise<FriendRequest> {
    return this.prismaService.friendRequests.create({
      data: createFriendRequestDb,
    });
  }

  async getFriendRequests(receiverID: string): Promise<FriendRequest[]> {
    return this.prismaService.friendRequests.findMany({
      include: {
        sender: true,
      },
      where: { receiverID: receiverID },
    });
  }

  findAll(): Promise<FriendRequest[]> {
    return this.prismaService.friendRequests.findMany();
  }

  remove(receiverID: string, senderID: string): Promise<{ count: number }> {
    return this.prismaService.friendRequests.deleteMany({
      where: {
        OR: [
          { senderID: senderID, receiverID: receiverID },
          { receiverID: senderID, senderID: receiverID },
        ],
      },
    });
  }

  findOne(
    createFriendRequestDb: CreateFriendRequestDb,
  ): Promise<FriendRequest> {
    return this.prismaService.friendRequests.findFirst({
      where: {
        OR: [
          {
            receiverID: createFriendRequestDb.receiverID,
            senderID: createFriendRequestDb.senderID,
          },
          {
            receiverID: createFriendRequestDb.senderID,
            senderID: createFriendRequestDb.receiverID,
          },
        ],
      },
    });
  }

  acceptRequest(
    createFriendRequestDb: CreateFriendRequestDb,
  ): Promise<[FriendStatus, any]> {
    return this.prismaService.$transaction([
      this.prismaService.friendStatus.create({ data: createFriendRequestDb }),
      this.prismaService.friendRequests.deleteMany({
        where: {
          OR: [
            {
              senderID: createFriendRequestDb.senderID,
              receiverID: createFriendRequestDb.receiverID,
            },
            {
              receiverID: createFriendRequestDb.senderID,
              senderID: createFriendRequestDb.receiverID,
            },
          ],
        },
      }),
    ]);
  }

  async sendRequest(
    userID: string,
    createFriendRequestDb: CreateFriendRequestDb,
  ) {
    const friendStatus: friendStatus = await this.friendStatusService.findOne(
      createFriendRequestDb.senderID,
      createFriendRequestDb.receiverID,
    );
    if (createFriendRequestDb.senderID == createFriendRequestDb.receiverID)
      throw new HttpException('', HttpStatus.FORBIDDEN);
    if (friendStatus)
      throw new HttpException(
        'you are already friends :D',
        HttpStatus.CONFLICT,
      );
    const friendReq: FriendRequest = await this.findOne(createFriendRequestDb);
    if (friendReq != null && friendReq.senderID != userID) {
      const res = await this.acceptRequest(createFriendRequestDb);
      // console.log('>>>>>>>>>>>>>>>>> here', friendReq, friendStatus);
      this.eventEmitter.emit('acceptFriend', {}, { data: friendReq });
      return { skipRefresh: true };
    } else if (friendReq)
      throw new HttpException(
        'Friend request already sent',
        HttpStatus.CONFLICT,
      );
    return this.create(createFriendRequestDb);
  }
}
