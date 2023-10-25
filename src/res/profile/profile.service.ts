import { Injectable, Logger } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(ProfileService.name);

  async create(user: ActiveUserData, createProfileDto: CreateProfileDto) {
    this.logger.log(`create Profile for user id: ${user.sub}`);

    const result = await this.prismaService.profile.create({
      data: createProfileDto,
    });

    await this.prismaService.user.update({
      where: { id: user.sub },
      data: {
        profile: {
          connect: {
            id: result.id,
          },
        },
      },
    });

    return result;
  }

  async findSelf(user: ActiveUserData) {
    this.logger.log(`findSelf on user id: ${user.sub}`);

    const result = await this.prismaService.profile.findFirst({
      where: { user: { id: user.sub } },
    });

    this.logger.verbose(`profile for user id ${user.sub}: ${result}`);

    return result;
  }

  async findOne(id: string) {
    this.logger.log(`findOne Profile for user id: ${id}`);

    const result = await this.prismaService.profile.findFirst({
      where: {
        id,
      },
    });

    return result;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  async remove(user: ActiveUserData) {
    this.logger.log(`delete Profile for user id: ${user.sub}`);

    const result = await this.prismaService.profile.deleteMany({
      where: { user: { id: user.sub } },
    });

    return result;
  }
}
