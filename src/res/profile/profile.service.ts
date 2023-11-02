import { Injectable, Logger } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';
import { MatchService } from '../match/match.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly matchService: MatchService,
  ) {}
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

  async findSelfData(user: ActiveUserData) {
    const result = await this.prismaService.user.findUnique({
      where: { id: user.sub },
      select: {
        id: true,
        avatarUrl: true,
        bannerUrl: true,
        userName: true,
        profile: true,
      },
    });

    this.logger.verbose(`findSelfData returned: `, result);

    const xpRequirements = {
      current: this.calculateRequiredXp(result.profile.level + 1),
      previous: this.calculateRequiredXp(result.profile.level),
    };

    return { ...result, username: result.userName, xpRequirements };
  }

  async findDataByUserId(id: string) {
    const result = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        avatarUrl: true,
        bannerUrl: true,
        userName: true,
        profile: true,
      },
    });

    const xpRequirements = {
      current: this.calculateRequiredXp(result.profile.level + 1),
      previous: this.calculateRequiredXp(result.profile.level),
    };

    return { ...result, username: result.userName, xpRequirements };
  }

  async findDataByUsername(name: string) {
    const result = await this.prismaService.user.findUnique({
      where: { userName: name },
      select: {
        id: true,
        avatarUrl: true,
        bannerUrl: true,
        userName: true,
        profile: true,
      },
    });

    const xpRequirements = {
      current: this.calculateRequiredXp(result.profile.level + 1),
      previous: this.calculateRequiredXp(result.profile.level),
    };

    return { ...result, username: result.userName, xpRequirements };
  }

  async getLeaderboardData() {
    const result = await this.prismaService.user.findMany({
      select: {
        id: true,
        avatarUrl: true,
        bannerUrl: true,
        userName: true,
        profile: true,
      },
    });

    const promises = result.map(async (profile) => {
      const stats = await this.matchService.getStatsById(profile.id);
      return { ...profile, winrate: stats.winrate, games: stats.total };
    });

    const profilesWithStats = await Promise.all(promises);

    profilesWithStats.sort((a, b) => b.profile.rating - a.profile.rating);

    return profilesWithStats;
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

  calculateRequiredXp(level: number) {
    const formula = 10 * (((level - 1) * level) / 2);

    return formula;
  }
}
