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
import { GithubOAuthGuard } from './github-oauth.guard';
import { ProviderAuthenticationService } from '../provider-authentication.service';

@Public()
@Controller('githubAuthentication')
export class GithubAuthenticationController {
  constructor(
    private providerAuthenticationService: ProviderAuthenticationService,
  ) {}
  @Get('login')
  @UseGuards(GithubOAuthGuard)
  handleLogin() {
    return 'login';
  }

  @Get('redirect')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GithubOAuthGuard)
  async handleRedirect(@Req() request, @Res({ passthrough: true }) response) {
    const { access_token } = await this.providerAuthenticationService.signIn(
      request.user,
    );
    response.cookie('USER', access_token);
    response.redirect(process.env.FRONTEND_HOST)
  }
}
