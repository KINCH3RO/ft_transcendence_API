import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';
import { AssignProductDto } from './dto/assign-product.dto';
import { Product } from './entities/product.entity';
import { ProfileService } from '../profile/profile.service';
import { Profile } from '../profile/entities/profile.entity';
import { UpdateProfileDto } from '../profile/dto/update-profile.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly profileService: ProfileService,
  ) {}

  // create(createProductDto: CreateProductDto) {
  //   return 'This action adds a new product';
  // }

  async assign(user: ActiveUserData, assignProductDto: AssignProductDto) {
    const profile: Profile = await this.profileService.findOneByUserId(
      user.sub,
    );

    const product: Product = await this.prismaService.product.findUnique({
      where: { id: assignProductDto.id },
    });

    if (profile.coins < product.price)
      throw new HttpException(
        "You don't have enough coins to buy this item",
        HttpStatus.FORBIDDEN,
      );

    const promises = [
      this.profileService.update(user.sub, {
        coins: profile.coins - product.price,
      }),

      this.prismaService.product.update({
        where: { id: assignProductDto.id },
        data: {
          users: {
            connect: { id: user.sub },
          },
        },
      }),
    ];

    await Promise.all(promises);
  }

  async findAll(currUserId: string) {
    const product: any = await this.prismaService.product.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        price: true,
        color: true,
        img: true,
        users: {
          select: {
            id: true,
          },
        },
      },
    });

    return product.map((item) => {
      if (item.users.find((x) => x.id === currUserId)) item['owned'] = true;
      else item['owned'] = false;
      return item;
    });
  }

  findAllUserProduct(user: ActiveUserData) {
    return this.prismaService.product.findMany({
      where: {
        users: {
          some: {
            id: user.sub,
          },
        },
      },
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} product`;
  // }

  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} product`;
  // }
}
