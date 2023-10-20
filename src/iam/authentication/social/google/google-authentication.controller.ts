import {
  Controller,
  Get,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GoogleOAuthGuard } from './google-oauth.guard';
import { Public } from '../../decorators/public.decorator';
import { GoogleAuthenticationService } from './google-authentication.service';

@Public()
@Controller('googleAuthentication')
export class GoogleAuthenticationController {
  constructor(
    private googleAuthenticationService: GoogleAuthenticationService,
  ) {}
  @Get('login')
  @UseGuards(GoogleOAuthGuard)
  handleLogin() {
    return 'login';
  }

  @Get('redirect')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleOAuthGuard)
  handleRedirect(@Req() request) {
    return this.googleAuthenticationService.signIn(request.user);
  }
}
