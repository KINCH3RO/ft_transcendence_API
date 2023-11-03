import {
  Controller,
  Get,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Public } from '../../decorators/public.decorator';
import { FortytwoOAuthGuard } from './fortytwo-oauth.guard';
import { ProviderAuthenticationService } from '../provider-authentication.service';

@Public()
@Controller('fortytwoAuthentication')
export class FortytwoAuthenticationController {
  constructor(
    private providerAuthenticationService: ProviderAuthenticationService,
  ) {}
  @Get('login')
  @UseGuards(FortytwoOAuthGuard)
  handleLogin() {
    return 'login';
  }

  @Get('redirect')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FortytwoOAuthGuard)
  async handleRedirect(@Req() request, @Res({ passthrough: true }) response) {
    const { access_token, provider_info, twoFactorAuth } =
      await this.providerAuthenticationService.signIn(request.user);
    if (twoFactorAuth) response.cookie('TWO_AUTH_FACT', 'activated');
    if (access_token) response.cookie('INFO', access_token);
    else response.cookie('PROVIDER', provider_info);
    response.redirect(`${process.env.FRONTEND_HOST}/authCallback`);
  }
}
