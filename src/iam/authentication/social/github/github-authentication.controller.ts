import {
  Controller,
  Get,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
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
  handleRedirect(@Req() request) {
    return this.providerAuthenticationService.signIn(request.user);
  }
}
