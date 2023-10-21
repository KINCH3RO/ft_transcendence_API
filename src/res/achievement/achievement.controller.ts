import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AssignAchievementDto } from './dto/assign-achievement.dto';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';

@Controller('achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Post()
  assign(
    @ActiveUser() user: ActiveUserData,
    @Body() assignAchievementDto: AssignAchievementDto,
  ) {
    return this.achievementService.assign(user, assignAchievementDto);
  }

  @Get('user')
  findAllUser(@ActiveUser() user: ActiveUserData) {
    return this.achievementService.findAllUser(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.achievementService.findOne(id);
  }
}
