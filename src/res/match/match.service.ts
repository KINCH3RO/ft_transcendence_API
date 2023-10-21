import { Injectable, Logger } from '@nestjs/common';
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
      data: {
        winnerID: createMatchDto.winnerID,
        loserID: createMatchDto.loserID,
        winnerScore: createMatchDto.winnerScore,
        loserScore: createMatchDto.loserScore,
        gameMode: createMatchDto.gameMode,
        ranked: createMatchDto.ranked,
      },
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

  async findOne(id: number) {
    this.logger.log(`findOne for match with id: ${id}`);

    const result = await this.prismaService.matches.findUnique({
      where: {
        id: id,
      },
    });

    this.logger.verbose(result);
    return result;
  }

  async update(id: number, updateMatchDto: UpdateMatchDto) {
    const result = await this.prismaService.matches.update({
      where: {
        id,
      },
      data: {
        winnerID: updateMatchDto.winnerID,
        loserID: updateMatchDto.loserID,
        winnerScore: updateMatchDto.winnerScore,
        loserScore: updateMatchDto.loserScore,
        gameMode: updateMatchDto.gameMode,
        ranked: updateMatchDto.ranked,
      },
    });
    this.logger.debug(
      `update Match ${result.winnerID} vs ${result.loserID} date: ${result.date}`,
    );
    return result;
  }

  async remove(id: number) {
    const result = await this.prismaService.matches.delete({
      where: {
        id: id,
      },
    });

    this.logger.debug(
      `delete Match ${result.winnerID} vs ${result.loserID} date: ${result.date}`,
    );
    return result;
  }
}
