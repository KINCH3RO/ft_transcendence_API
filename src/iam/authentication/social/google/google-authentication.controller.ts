import {
  Controller,
  Get,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Res,
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
    const { access_token } = await this.providerAuthenticationService.signIn(
      request.user,
    );
    response.cookie('USER', access_token);
    response.redirect(process.env.FRONTEND_HOST);
  }
}
