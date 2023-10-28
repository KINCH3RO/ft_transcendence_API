import {
  Controller,
  Get,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Res,
  Query,
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
  async handleRedirect(@Req() request, @Res({ passthrough: true }) response) {
    const { access_token, provider_info } =
      await this.providerAuthenticationService.signIn(request.user);
    if (access_token) response.cookie('INFO', access_token);
    else response.cookie('PROVIDER', provider_info);
    response.redirect(`${process.env.FRONTEND_HOST}/authCallback`);
  }
}
