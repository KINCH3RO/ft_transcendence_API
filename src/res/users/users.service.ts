import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { provider } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { userName: username } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  findByProviderId(providerID: string, providerType: provider) {
    return this.prisma.user.findFirst({
      where: {
        associatedAccounts: {
          some: {
            providerID,
            provider: providerType,
          },
        },
      },
    });
  }

  createByProvider(providerData, providerType: provider) {
    return this.prisma.user.create({
      data: {
        email: providerData.email,
        fullName: providerData.fullName,
        userName: providerData.displayName,
        profile: {
          create: {},
        },
        associatedAccounts: {
          create: {
            email: providerData.email,
            provider: 'GOOGLE',
            providerID: providerData.id,
          },
        },
      },
    });
  }
}
