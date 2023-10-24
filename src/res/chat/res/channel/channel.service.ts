import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { channelUser } from '@prisma/client';

@Injectable()
export class ChannelService {
  constructor(
    private prisma: PrismaService,
    private hashingService: HashingService,
  ) {}

  async create(createChannelDto: CreateChannelDto, id: string) {
    return this.prisma.channel.create({
      data: {
        imageUrl: createChannelDto.imageUrl,
        name: createChannelDto.name,
        visibility: createChannelDto.visibility,
        password: await this.hashingService.hash(createChannelDto.password),
        channels: {
          create: {
            userID: id,
            role: 'OWNER',
            status: 'FREE',
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.channel.findMany();
  }

  findOne(id: string) {
    return this.prisma.channel.findUnique({ where: { id } });
  }

  async update(updateChannelDto: UpdateChannelDto) {
    return this.prisma.channel.update({
      where: {
        id: updateChannelDto.id
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
      where: { userID_channelID: { channelID: removeChannelDto.id, userID: userId } },
    })

    if (!actor && actor.role != 'OWNER')
      throw new HttpException('Nice try', HttpStatus.FORBIDDEN);

    const deleteMessages = this.prisma.message.deleteMany({
      where: { channelID: removeChannelDto.id },
    });
    const deleteUsers = this.prisma.channelUser.deleteMany({
      where: { channelID: removeChannelDto.id },
    });
    const deleteChannel = this.prisma.channel.delete({ where: { id: removeChannelDto.id } });

    return this.prisma.$transaction([
      deleteMessages,
      deleteUsers,
      deleteChannel,
    ]);
  }

  findChannelByName(name: string) {
    return this.prisma.channel.findMany({
      take: 20,
      where: {
        name: { startsWith: name, mode: 'insensitive' },
        visibility: { not: 'PRIVATE' },
      },
    });
  }
}
