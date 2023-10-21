import { Injectable, Logger } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';

@Injectable()
export class MatchService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(MatchService.name);

  create(createMatchDto: CreateMatchDto) {
    return 'This action adds a new match';
  }

  async findAll(user: ActiveUserData) {
    this.logger.debug(user);
    this.logger.log(`findAll for ${user.username}`);

    const result = await this.prismaService.matches.findMany({
      where: {
        OR: [
          {
            loserID: user.sub,
          },
          {
            winnerID: user.sub,
          },
        ],
      },
    });

    this.logger.log(result);
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
