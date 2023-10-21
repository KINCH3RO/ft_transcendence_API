import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { provider } from '@prisma/client';
import { ProviderUserData } from 'src/iam/interfaces/provider-data.interface';
import { SignUpDto } from 'src/iam/authentication/dto/sign-up.dto/sign-up.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(signUpDto: SignUpDto) {
    return this.prisma.user.create({
      data: {
        email: signUpDto.email,
        fullName: signUpDto.fullname,
        password: signUpDto.password,
        userName: signUpDto.username,
        profile: {
          create: {},
        },
      },
    });
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

  createByProvider(providerUserData: ProviderUserData, providerType: provider) {
    return this.prisma.user.create({
      data: {
        email: providerUserData.email,
        fullName: providerUserData.fullName,
        userName: providerUserData.username,
        avatarUrl: providerUserData.photo,
        profile: {
          create: {},
        },
        associatedAccounts: {
          create: {
            providerID: providerUserData.id,
            email: providerUserData.email,
            provider: providerUserData.providerType,
          },
        },
      },
    });
  }
}
