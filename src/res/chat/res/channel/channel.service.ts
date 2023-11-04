import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { channelUser } from '@prisma/client';
import { HashingService } from 'src/hashing/hashing.service';
import { WebSocketService } from 'src/res/web-socket/web-socket.service';

@Injectable()
export class ChannelService {
  constructor(
    private prisma: PrismaService,
    private hashingService: HashingService,
    private webSocketService: WebSocketService,
  ) {}

  async create(createChannelDto: CreateChannelDto, id: string) {
    return this.prisma.channel.create({
      select: {
        id: true,
        name: true,
        imageUrl: true,
        visibility: true,
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
            updatedAt: true,
          },
        },
        channels: true,
      },
      data: {
        imageUrl: createChannelDto.imageUrl,
        name: createChannelDto.name,
        visibility: createChannelDto.visibility,
        password: createChannelDto.password
          ? await this.hashingService.hash(createChannelDto.password)
          : null,
        channels: {
          create: {
            userID: id,
            role: 'OWNER',
            status: 'FREE',
          },
        },
        message: {},
      },
    });
  }

  findAll() {
    return this.prisma.channel.findMany();
  }

  async findOne(id: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { id },
      select: {
        id: true,
        channels: {
          select: {
            user: {
              select: {
                id: true,
                onlineStatus: true,
              },
            },
          },
        },
      },
    });

    channel.channels.map((item) => {
      item.user.onlineStatus = this.webSocketService.isOnline(item.user.id);
    });

    return channel;
  }

  async update(updateChannelDto: UpdateChannelDto) {
    return this.prisma.channel.update({
      where: {
        id: updateChannelDto.id,
      },
      data: {
        imageUrl: updateChannelDto.imageUrl,
        name: updateChannelDto.name,
        password: await this.hashingService.hash(updateChannelDto.password),
        visibility: updateChannelDto.visibility,
      },
    });
  }

  async remove(userId: string, removeChannelDto: UpdateChannelDto) {
    const actor: channelUser = await this.prisma.channelUser.findUnique({
      where: {
        userID_channelID: { channelID: removeChannelDto.id, userID: userId },
      },
    });

    if (actor && actor.role != 'OWNER')
      throw new HttpException('Nice try', HttpStatus.FORBIDDEN);

    const deleteMessages = this.prisma.message.deleteMany({
      where: { channelID: removeChannelDto.id },
    });
    const deleteUsers = this.prisma.channelUser.deleteMany({
      where: { channelID: removeChannelDto.id },
    });
    const deleteChannel = this.prisma.channel.delete({
      where: { id: removeChannelDto.id },
    });

    return this.prisma.$transaction([
      deleteMessages,
      deleteUsers,
      deleteChannel,
    ]);
  }

  async findChannelByName(currentUserId: string, name: string) {
    let list: any = await this.prisma.channel.findMany({
      take: 20,
      where: {
        name: { startsWith: name, mode: 'insensitive' },
        visibility: { not: 'PRIVATE' },
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        visibility: true,
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
            updatedAt: true,
          },
        },
        channels: true,
      },
    });

    list.map((item) => {
      let channel_user = item.channels.find((x) => x.userID == currentUserId);
      if (channel_user) {
        item['isMemeber'] = true;
        item['owner'] = channel_user.role;
      } else
        item['isMemeber'] = false;
    });



    return list;
  }

  async listCurrentUserChannel(currentUserId: string) {
    let list: any = await this.prisma.channel.findMany({
      where: { channels: { some: { userID: currentUserId } } },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        visibility: true,
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
            updatedAt: true,
          },
        },
        channels: true,
      },
    });

    list.map((item) => {
      let channel_user = item.channels.find((x) => x.userID == currentUserId);
      if (channel_user) {
        item['isMemeber'] = true;
        item['owner'] = channel_user.role;
      } else
        item['isMemeber'] = false;
    });

    return list;
  }
}
