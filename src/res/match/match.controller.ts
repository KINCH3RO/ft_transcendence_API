import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.create(createMatchDto);
  }

  @Get()
  findAll(@ActiveUser() user: ActiveUserData) {
    return this.matchService.findAll(user);
  }

  @Get('offset/:id')
  findAllByIdByOffset(
    @Param('id') id: string,
    @Query('offset') offset: number,
  ) {
    return this.matchService.findAllByIdByOffset(id, offset);
  }

  @Get(':id')
  findAllById(@Param('id') id: string) {
    return this.matchService.findAllById(id);
  }

  @Get('stats')
  getStats(@ActiveUser() user: ActiveUserData) {
    return this.matchService.getStats(user);
  }

  @Get('stats/:id')
  getStatsById(@Param('id') id: string) {
    return this.matchService.getStatsById(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.matchService.findOne(id);
  }

  @Get('latest/:take')
  getLatestMatches(
    @Param('take', ParseIntPipe) take: number,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.matchService.getLatest(user, take);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    return this.matchService.update(id, updateMatchDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.matchService.remove(id);
  }
}
