import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';

@Injectable()
export class MatchService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(MatchService.name);

  async create(createMatchDto: CreateMatchDto) {
    const result = await this.prismaService.matches.create({
      data: createMatchDto,
    });

    return result;
  }

  async findAll(user: ActiveUserData) {
    const result = await this.prismaService.matches.findMany({
      where: {
        OR: [
          {
            winnerID: {
              equals: user.sub,
            },
          },
          {
            loserID: {
              equals: user.sub,
            },
          },
        ],
      },
      orderBy: { date: 'desc' },
    });

    return result;
  }

  async findAllById(id: string) {
    const result = await this.prismaService.matches.findMany({
      where: {
        OR: [
          {
            winnerID: {
              equals: id,
            },
          },
          {
            loserID: {
              equals: id,
            },
          },
        ],
      },
      orderBy: { date: 'desc' },
    });

    return result;
  }

  async findVsByIdByOffset(user: ActiveUserData, id: string, offset: number) {
    const result = await this.prismaService.matches.findMany({
      where: {
        OR: [
          {
            winnerID: {
              equals: user.sub,
            },
            loserID: {
              equals: id,
            },
          },
          {
            winnerID: {
              equals: id,
            },
            loserID: {
              equals: user.sub,
            },
          },
        ],
      },
      skip: offset,
      take: 20,
      orderBy: { date: 'desc' },
    });

    return result;
  }

  async findAllByIdByOffset(id: string, offset: number) {
    const result = await this.prismaService.matches.findMany({
      where: {
        OR: [
          {
            winnerID: {
              equals: id,
            },
          },
          {
            loserID: {
              equals: id,
            },
          },
        ],
      },
      skip: offset,
      take: 20,
      orderBy: { date: 'desc' },
    });

    return result;
  }

  async getStats(user: ActiveUserData) {
    const matches = await this.findAll(user);
    let highest = 0;
    let currentSum = 0;
    let wins = 0;

    matches.map((match) => {
      if (match.winnerID === user.sub) {
        wins++;
        currentSum++;
      } else currentSum = 0;
      if (currentSum > highest) highest = currentSum;
    });

    return {
      winstreak: highest,
      winrate: (wins / matches.length) * 100,
      total: matches.length,
    };
  }

  async getStatsById(id: string) {
    const matches = await this.findAllById(id);
    let highest = 0;
    let currentSum = 0;
    let wins = 0;
    let rankedWins = 0;
    let totalRanked = 0;

    matches.map((match) => {
      if (match.ranked) totalRanked++;
      if (match.winnerID === id) {
        wins++;
        rankedWins += match.ranked ? 1 : 0;
        currentSum++;
      } else currentSum = 0;
      if (currentSum > highest) highest = currentSum;
    });

    return {
      winstreak: highest,
      winrate: (wins / matches.length) * 100,
      rankedWinrate: (rankedWins / totalRanked) * 100,
      total: matches.length,
    };
  }

  async findOne(id: number) {
    const result = await this.prismaService.matches.findUnique({
      where: {
        id,
      },
    });

    return result;
  }

  async getLatest(user: ActiveUserData, take: number) {
    const result = await this.prismaService.matches.findMany({
      where: {
        OR: [
          {
            winnerID: {
              equals: user.sub,
            },
          },
          {
            loserID: {
              equals: user.sub,
            },
          },
        ],
      },
      take,
      orderBy: { date: 'desc' },
    });

    return result;
  }

  async update(id: number, updateMatchDto: UpdateMatchDto) {
    let result = null;

    try {
      result = await this.prismaService.matches.update({
        where: {
          id,
        },
        data: updateMatchDto,
      });
    } catch (error) {
      this.logger.error(`Attempted to update match id: ${id}`);
      throw new HttpException("Match doesn't exists", HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async remove(id: number) {
    let result = null;

    try {
      result = await this.prismaService.matches.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      this.logger.error(`Attempted to delete match id: ${id}`);
      throw new HttpException("Match doesn't exist", HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
