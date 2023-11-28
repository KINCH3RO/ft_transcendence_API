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

  findLobbySkins(idOne: string, idTwo: string) {
    const _skins = [
      this.prismaService.repo.findFirst({
        where: { user: { id: idOne } },
        include: {
          mapSkin: true,
          paddleSkin: true,
        },
      }),
      this.prismaService.repo.findFirst({
        where: { user: { id: idTwo } },
        include: {
          mapSkin: true,
          paddleSkin: true,
        },
      }),
    ];

    const skins = Promise.all(_skins);

    return skins;
  }

  // const skins = this.prismaService.repo.findMany({
  //   where: {
  //     OR: [{ user: { id: idOne } }, { user: { id: idTwo } }],
  //   },
  //   include: {
  //     mapSkin: true,
  //     paddleSkin: true,
  //   },
  // });
}
