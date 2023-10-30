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

    this.logger.debug(
      `create Match ${result.winnerID} vs ${result.loserID} date: ${result.date}`,
    );
    return result;
  }

  async findAll(user: ActiveUserData) {
    this.logger.log(`findAll for ${user.username}`);

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
    });

    this.logger.verbose(result);
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

  async findOne(id: number) {
    this.logger.log(`findOne for match with id: ${id}`);

    const result = await this.prismaService.matches.findUnique({
      where: {
        id,
      },
    });

    this.logger.verbose(result);
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

    this.logger.debug(
      `update Match ${result.winnerID} vs ${result.loserID} date: ${result.date}`,
    );
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

    this.logger.debug(
      `delete Match ${result.winnerID} vs ${result.loserID} date: ${result.date}`,
    );
    return result;
  }
}
