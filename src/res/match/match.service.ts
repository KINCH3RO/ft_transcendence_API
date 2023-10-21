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

  findOne(id: number) {
    return `This action returns a #${id} match`;
  }

  update(id: number, updateMatchDto: UpdateMatchDto) {
    return `This action updates a #${id} match`;
  }

  remove(id: number) {
    return `This action removes a #${id} match`;
  }
}
