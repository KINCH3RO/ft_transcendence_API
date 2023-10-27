import { Injectable, Logger } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(ProfileService.name);

  async findSelf(user: ActiveUserData) {
    this.logger.log(`findSelf on user id: ${user.sub}`);

    const result = await this.prismaService.profile.findFirst({
      where: { user: { id: user.sub } },
    });

    this.logger.verbose(`profile for user id ${user.sub}: ${result}`);

    return result;
  }

  async findOneByUserId(id: string) {
    this.logger.log(`findOne Profile for user id: ${id}`);

    const result = await this.prismaService.profile.findFirst({
      where: {
        user: { id },
      },
    });

    return result;
  }

  update(user: ActiveUserData, updateProfileDto: UpdateProfileDto) {
    this.logger.log(`update Profile for user id: ${user.sub}`);

    const result = this.prismaService.profile.updateMany({
      data: updateProfileDto,
      where: {
        user: { id: user.sub },
      },
    });

    return result;
  }
}
