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
    const { access_token } = await this.providerAuthenticationService.signIn(
      request.user,
    );
    response.cookie('USER', access_token);
    response.redirect('http://localhost:3000/');
  }
}
