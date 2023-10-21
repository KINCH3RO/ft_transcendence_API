import {
  Controller,
  Get,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
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
  handleRedirect(@Req() request) {
    return this.providerAuthenticationService.signIn(request.user);
  }
}
