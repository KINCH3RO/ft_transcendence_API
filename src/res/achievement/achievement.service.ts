import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AssignAchievementDto } from './dto/assign-achievement.dto';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AchievementService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(AchievementService.name);

  async assign(user: string, assignAchievementDto: AssignAchievementDto) {
    let result = null;

    try {
      const existingAchievement =
        await this.prismaService.achievements.findFirst({
          where: {
            users: { some: { id: user } },
            id: assignAchievementDto.id,
          },
        });
      if (existingAchievement) return null;
      console.log('userid:', user, 'achievement id:', assignAchievementDto.id);
      result = await this.prismaService.achievements.update({
        where: { id: assignAchievementDto.id },
        data: {
          users: {
            connect: { id: user },
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        "Achievement doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }

  async findAllAchievements() {
    return await this.prismaService.achievements.findMany({});
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

  async findAllUserById(id: string) {
    const result = await this.prismaService.achievements.findMany({
      where: {
        users: {
          some: {
            id,
          },
        },
      },
    });

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

  @OnEvent('user.created')
  async welcomeAchievement({ id }: { id: string }) {
    await this.assign(id, { id: 10, name: 'Welcome' });
  }

  @OnEvent('user.firstGame')
  async firstGameAchievement({ id }: { id: string }) {
    return await this.assign(id, { id: 11, name: 'First Game' });
  }
}
