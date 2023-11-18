import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ActiveUser } from './decorators/active-user.decorator';
import { OtpAuthService } from './otp-auth.service';
import { ActiveUserData } from '../interfaces/active-user.interface';
import { toDataURL } from 'qrcode';
import { Public } from './decorators/public.decorator';
import { OtpVerifyDto } from './dto/otp-verify.dto';

@Controller('otpAauth')
export class OtpAuthController {
  constructor(private otpService: OtpAuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/activate')
  async activate(@ActiveUser() user: ActiveUserData) {
    return this.otpService.enable2FA(user);
  }

  @Get('/qrcode')
  async getCode(@ActiveUser() user: ActiveUserData) {
    const uri = await this.otpService.getCode(user);
    return toDataURL(uri);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/deactivate')
  async deactivate(@ActiveUser() user: ActiveUserData) {
    return this.otpService.disable2FA(user.sub);
  }

  @Public()
  @Post('/verify')
  async verify(@Body() otpVerifyDto: OtpVerifyDto) {
    return this.otpService.verify(otpVerifyDto);
  }
}
