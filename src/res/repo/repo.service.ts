import { Injectable } from '@nestjs/common';
import { CreateRepoDto } from './dto/create-repo.dto';
import { UpdateRepoDto } from './dto/update-repo.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RepoService {
  constructor(private readonly prismaService: PrismaService) {}

  // create(createRepoDto: CreateRepoDto) {
  //   return 'This action adds a new repo';
  // }

  // findAll() {
  //   return `This action returns all repo`;
  // }

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

  // remove(id: number) {
  //   return `This action removes a #${id} repo`;
  // }
}
