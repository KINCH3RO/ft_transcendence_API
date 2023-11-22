import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';
import { AssignProductDto } from './dto/assign-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  // create(createProductDto: CreateProductDto) {
  //   return 'This action adds a new product';
  // }

  assign(user: ActiveUserData, assignProductDto: AssignProductDto) {
    return this.prismaService.product.update({
      where: { id: assignProductDto.id },
      data: {
        users: {
          connect: { id: user.sub },
        },
      },
    });
  }

  findAll() {
    return this.prismaService.product.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        price: true,
        selected: true,
        users: {
          select: {
            id: true,
          },
        },
      },
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
