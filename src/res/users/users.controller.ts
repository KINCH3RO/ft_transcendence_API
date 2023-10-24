import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('current')
  findActive(@ActiveUser() user: ActiveUserData) {
    return this.usersService.findOne(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  update(
    @ActiveUser() user: ActiveUserData,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log(updateUserDto);
    return this.usersService.update(user.sub, updateUserDto);
  }

  @Patch('password')
  updatePassword(
    @ActiveUser() user: ActiveUserData,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
	return this.usersService.updatePassword(user.sub, updatePasswordDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('/list/:name')
  findByName(@Param('name') name: string) {
    return this.usersService.findByName(name);
  }
}
