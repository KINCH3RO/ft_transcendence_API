import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { channel } from 'diagnostics_channel';

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

  update(id: string, updateChannelDto: UpdateChannelDto) {
    return this.prisma.channel.update({
      where: {
        id
      },
      data: {
        imageUrl: updateChannelDto.imageUrl,
        name: updateChannelDto.name,
        password: updateChannelDto.password,
        visibility: updateChannelDto.visibility,
      },
    });
  }

  remove(id: string) {
    return this.prisma.channel.delete({ where: { id } });
  }
}
