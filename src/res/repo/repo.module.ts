import { Module } from '@nestjs/common';
import { RepoService } from './repo.service';
import { RepoController } from './repo.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProfileModule } from '../profile/profile.module';

@Module({
  controllers: [RepoController],
  providers: [RepoService],
  imports: [PrismaModule, ProfileModule],
  exports: [RepoService],
})
export class RepoModule {}
