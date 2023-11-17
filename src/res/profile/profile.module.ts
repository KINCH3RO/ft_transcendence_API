import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MatchModule } from '../match/match.module';

@Module({
  exports: [ProfileService],
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [PrismaModule, MatchModule],
})
export class ProfileModule {}
