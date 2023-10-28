import { Controller, Body, Post, HttpStatus, HttpCode } from '@nestjs/common';
import { ActiveUser } from '../decorators/active-user.decorator';
import { ProviderAuthenticationService } from './provider-authentication.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';
import { Public } from '../decorators/public.decorator';
import { ProviderTokenDto } from '../dto/provider-token.dto';

@Controller('/provider')
export class MergeController {
  constructor(private authService: ProviderAuthenticationService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/merge')
  merge(
    @ActiveUser() activeUser: ActiveUserData,
    @Body() providerTokenDto: ProviderTokenDto,
  ) {
    return this.authService.merge(
      activeUser.sub,
      providerTokenDto.providerInfoToken,
    );
  }

  @Post('/create')
  @Public()
  create(@Body() providerTokenDto: ProviderTokenDto) {
    return this.authService.create(providerTokenDto.providerInfoToken);
  }
}
