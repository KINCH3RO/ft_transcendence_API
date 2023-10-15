import { Controller, HttpStatus,HttpCode,Body,Post,Get } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { Public } from './decorators/public.decorator';

@Public()
@Controller('authentication')
export class AuthenticationController {
  constructor(private authSerive : AuthenticationService) {}
  
  @HttpCode(HttpStatus.OK)
  @Post("sign-in")
  signIn(@Body() signInDto : SignInDto) {
	return this.authSerive.signIn(signInDto)
  } 

  @Post("sign-up")
  signUp(@Body() signUpDto : SignUpDto) {
	return this.authSerive.signUp(signUpDto)
  }
}
