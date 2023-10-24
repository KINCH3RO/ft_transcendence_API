import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HashingModule } from 'src/hashing/hashing.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule, HashingModule],
  exports: [UsersService],
})
export class UsersModule {}
