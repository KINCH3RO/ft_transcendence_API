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
import { ProviderAuthenticationService } from '../provider-authentication.service';

@Public()
@Controller('googleAuthentication')
export class GoogleAuthenticationController {
  constructor(
    private providerAuthenticationService: ProviderAuthenticationService,
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
    return this.providerAuthenticationService.signIn(request.user);
  }
}
