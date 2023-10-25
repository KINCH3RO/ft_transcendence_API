import { Injectable, Logger } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(ProfileService.name);

  create(createProfileDto: CreateProfileDto) {
    return 'This action adds a new profile';
  }

  async findSelf(user: ActiveUserData) {
    this.logger.log(`findSelf on user id: ${user.sub}`);

    const result = await this.prismaService.profile.findUnique({
      where: { id: user.sub },
    });

    this.logger.verbose(`profile for user id ${user.sub}: ${result}`);

    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
