import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AssignAchievementDto } from './dto/assign-achievement.dto';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AchievementService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(AchievementService.name);

  async assign(
    user: ActiveUserData,
    assignAchievementDto: AssignAchievementDto,
  ) {
    let result = null;

    try {
      result = await this.prismaService.achievements.update({
        where: { id: assignAchievementDto.id },
        data: {
          users: {
            connect: { id: user.sub },
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        "Achievement doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }

    this.logger.debug(`assign Achievement ${result.name} to ${user.username}`);
    return result;
  }

  async findAllUser(user: ActiveUserData) {
    this.logger.log(`findAll Achievements for user ${user.username}`);

    const result = await this.prismaService.achievements.findMany({
      where: {
        users: {
          some: {
            id: user.sub,
          },
        },
      },
    });

    this.logger.verbose(result);
    return result;
  }

  async findOne(id: number) {
    this.logger.log(`findOne Achievement with id: ${id}`);

    const result = await this.prismaService.achievements.findUnique({
      where: {
        id,
      },
    });

    this.logger.verbose(result);
    return result;
  }
}
