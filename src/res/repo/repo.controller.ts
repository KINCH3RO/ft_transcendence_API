import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RepoService } from './repo.service';
import { CreateRepoDto } from './dto/create-repo.dto';
import { UpdateRepoDto } from './dto/update-repo.dto';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';

@Controller('repo')
export class RepoController {
  constructor(private readonly repoService: RepoService) {}

  // @Post()
  // create(@Body() createRepoDto: CreateRepoDto) {
  //   return this.repoService.create(createRepoDto);
  // }

  // @Get()
  // findAll() {
  //   return this.repoService.findAll();
  // }

  @Get()
  findOne(@ActiveUser() user: ActiveUserData) {
    return this.repoService.findOne(user.sub);
  }

  @Post()
  update(@ActiveUser() user: ActiveUserData, @Body() updateRepoDto: UpdateRepoDto) {
    return this.repoService.update(user.sub, updateRepoDto);
  }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.repoService.remove(+id);
//   }

}
