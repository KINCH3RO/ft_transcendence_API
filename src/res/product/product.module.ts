import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProfileModule } from '../profile/profile.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [PrismaModule, ProfileModule],
})
export class ProductModule {}
