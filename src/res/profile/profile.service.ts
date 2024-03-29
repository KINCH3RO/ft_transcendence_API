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
    const result = await this.prismaService.profile.findFirst({
      where: { user: { id: user.sub } },
    });

    return result;
  }

  async findOneByUserId(id: string) {
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
      orderBy: [{ profile: { rating: 'desc' } }, { userName: 'asc' }],
      take: 10,
    });

    const promises = result.map(async (profile) => {
      const stats = await this.matchService.getStatsById(profile.id);
      return {
        ...profile,
        username: profile.userName,
        winrate: stats.rankedWinrate,
        games: stats.total,
      };
    });

    const profilesWithStats = await Promise.all(promises);

    return profilesWithStats;
  }

  async getLeaderboardDataOffset(offset: number) {
    const result = await this.prismaService.user.findMany({
      select: {
        id: true,
        avatarUrl: true,
        bannerUrl: true,
        userName: true,
        profile: true,
      },
      orderBy: [{ profile: { rating: 'desc' } }, { userName: 'asc' }],
      take: 50,
      skip: offset,
    });

    const promises = result.map(async (profile) => {
      const stats = await this.matchService.getStatsById(profile.id);
      return {
        ...profile,
        username: profile.userName,
        winrate: stats.rankedWinrate,
        games: stats.total,
      };
    });

    const profilesWithStats = await Promise.all(promises);

    return profilesWithStats;
  }

  update(userId: string, updateProfileDto: UpdateProfileDto) {
    const result = this.prismaService.profile.updateMany({
      data: updateProfileDto,
      where: {
        user: { id: userId },
      },
    });

    return result;
  }

  calculateRequiredXp(level: number) {
    const formula = 650 * (((level - 1) * level) / 2);

    return formula;
  }
}
