import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductService } from './product.service';

import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';
import { AssignProductDto } from './dto/assign-product.dto';

@Controller('store')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  assign(
    @ActiveUser() user: ActiveUserData,
    @Body() assignProductDto: AssignProductDto,
  ) {
    return this.productService.assign(user, assignProductDto);
  }

  // @Post()
  // create(@Body() createProductDto: CreateProductDto) {
  //   return this.productService.create(createProductDto);
  // }

  @Get('items')
  async findAll(@ActiveUser() currUserId: ActiveUserData) {
    return this.productService.findAll(currUserId.sub);
  }

  @Get('user')
  findAllUser(@ActiveUser() user: ActiveUserData) {
    return this.productService.findAllUserProduct(user);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.productService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateStoreDto) {
  //   return this.productService.update(+id, updateProductDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productService.remove(+id);
  // }
}
