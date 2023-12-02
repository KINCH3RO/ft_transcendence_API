import { ForbiddenException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { provider } from '@prisma/client';
import { ProviderUserData } from 'src/iam/interfaces/provider-data.interface';
import { SignUpDto } from 'src/iam/authentication/dto/sign-up.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { HashingService } from 'src/hashing/hashing.service';
import { readdirSync } from 'fs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private hashingService: HashingService,
    private eventEmitter: EventEmitter2,
  ) {}

  getRandomImage(dir: string) {
    let files;
    let dirPath = process.cwd() + dir;
    try {
      files = readdirSync(dirPath);
    } catch (error) {
      return '';
    }
    let imageExtensions = ['png', 'jpg', 'jpeg', 'gif'];
    files = files.filter((file) =>
      imageExtensions.includes(file.split('.').pop()),
    );
    if (files.length <= 0) return '';
    const randomIndex = Math.floor(Math.random() * files.length);
    return (
      process.env.URL_PREFIX +
      dir.replace('/public', '') +
      '/' +
      files[randomIndex]
    );
  }

  async create(signUpDto: SignUpDto) {
    const user = await this.prisma.user.create({
      data: {
        email: signUpDto.email,
        fullName: signUpDto.fullname,
        password: signUpDto.password,
        userName: signUpDto.username,
        avatarUrl: this.getRandomImage('/public/assets/avatars/'),
        bannerUrl: this.getRandomImage('/public/assets/banners/'),
        profile: {
          create: {},
        },
        repo: {
          create: {},
        },
      },
    });

    this.eventEmitter.emit('user.created', { id: user.id });

    return user;
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        userName: true,
        avatarUrl: true,
        bannerUrl: true,
        password: true,
        twoFactorAuthEnabled: true,
      },
    });
    return { ...user, password: user.password ? true : false };
  }

  getAccounts(id: string) {
    return this.prisma.associatedAccount.findMany({ where: { userID: id } });
  }

  getOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { userName: username } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  remove(id: string) {
    this.prisma.user.delete({ where: { id } });
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

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.getOne(id);
    const password = await this.hashingService.hash(
      updatePasswordDto.newPassword,
    );
    if (!user.password)
      return this.prisma.user.update({
        where: { id },
        data: { password },
      });
    const isEqual = await this.hashingService.compare(
      updatePasswordDto.password,
      user.password,
    );
    if (!isEqual) throw new ForbiddenException({ message: 'wrong password' });
    return this.prisma.user.update({
      where: { id },
      data: { password },
    });
  }

  async createByProvider(providerUserData: ProviderUserData) {
    if (!providerUserData.photo)
      providerUserData.photo = this.getRandomImage('/public/assets/avatars/');
    try {
      const user = await this.prisma.user.create({
        data: {
          fullName: providerUserData.fullName,
          userName: providerUserData.username,
          avatarUrl: providerUserData.photo,
          bannerUrl: this.getRandomImage('/public/assets/banners/'),
          profile: {
            create: {},
          },
          repo: {
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

      this.eventEmitter.emit('user.created', { id: user.id });
      return user;
    } catch (err) {
      return null;
    }
  }

  findByName(name: string, id: string) {
    return this.prisma.user.findMany({
      where: {
        userName: {
          startsWith: name,
          mode: 'insensitive',
        },
        NOT: {
          id,
        },
      },
      take: 20,
    });
  }

  async addProvider(id: string, providerUserData: ProviderUserData) {
    return this.prisma.associatedAccount.create({
      data: {
        userID: id,
        providerID: providerUserData.id,
        provider: providerUserData.providerType,
        email: providerUserData.email,
      },
    });
  }
  deleteProvider(userID: string, providerType: provider) {
    return this.prisma.associatedAccount.deleteMany({
      where: {
        userID,
        provider: providerType,
      },
    });
  }
}
