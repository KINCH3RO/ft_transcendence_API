import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [MatchController],
  providers: [MatchService],
  imports: [PrismaModule],
  exports: [MatchService],
})
export class MatchModule {}
