import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  findSelf(@ActiveUser() user: ActiveUserData) {
    return this.profileService.findSelf(user);
  }

  @Get(':userId')
  findOneByUserId(@Param('userId') id: string) {
    return this.profileService.findOneByUserId(id);
  }

  @Get('data')
  findSelfData(@ActiveUser() user: ActiveUserData) {
    return this.profileService.findSelfData(user);
  }

  @Get('data/:userId')
  findDataByUserId(@Param('userId') id: string) {
    return this.profileService.findDataByUserId(id);
  }

  @Get('data/name/:name')
  findDataByUsername(@Param('name') name: string) {
    return this.profileService.findDataByUsername(name);
  }

  @Patch()
  update(
    @ActiveUser() user: ActiveUserData,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.update(user, updateProfileDto);
  }
}
