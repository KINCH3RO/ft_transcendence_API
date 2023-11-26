import { Injectable } from '@nestjs/common';
import { UpdateRepoDto } from './dto/update-repo.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RepoService {
  constructor(private readonly prismaService: PrismaService) {}

  findOne(id: string) {
    return this.prismaService.repo.findFirst({ where: { user: { id: id } } });
  }

  update(id: string, updateRepoDto: UpdateRepoDto) {
    return this.prismaService.repo.updateMany({
      data: updateRepoDto,
      where: {
        user: { id: id },
      },
    });
  }

  findSkins(id: string) {
    return this.prismaService.repo.findFirst({
      where: { user: { id } },
      include: {
        mapSkin: true,
        paddleSkin: true,
      },
    });
  }
}
