import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { UsersService } from 'src/res/users/users.service';
import { TokenService } from '../jwt/token.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private hashingService: HashingService,
    private userService: UsersService,
    private tokenService: TokenService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    signUpDto.password = await this.hashingService.hash(signUpDto.password);
    const user = await this.userService.create(signUpDto);
    return this.tokenService.getJwtToken(user);
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.findByUsername(signInDto.username);
    if (!user) throw new UnauthorizedException({ message: 'wrong username' });
    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!user || !isEqual)
      throw new UnauthorizedException({ message: 'wrong password' });
    return this.tokenService.getJwtToken(user);
  }
}
