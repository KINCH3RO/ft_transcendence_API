import { Controller, Get, Post, Body } from '@nestjs/common';
import { RepoService } from './repo.service';
import { UpdateRepoDto } from './dto/update-repo.dto';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';

@Controller('repo')
export class RepoController {
  constructor(private readonly repoService: RepoService) {}

  @Get()
  findOne(@ActiveUser() user: ActiveUserData) {
    return this.repoService.findOne(user.sub);
  }

  @Post()
  update(
    @ActiveUser() user: ActiveUserData,
    @Body() updateRepoDto: UpdateRepoDto,
  ) {
    return this.repoService.update(user.sub, updateRepoDto);
  }

  @Get('skins')
  findSkins(@ActiveUser() user: ActiveUserData) {
    return this.repoService.findSkins(user.sub);
  }
}
