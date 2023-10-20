import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/res/users/users.service';
import { TokenService } from '../jwt/token.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private prisma: PrismaService,
    private hashingService: HashingService,
    private userService: UsersService,
    private tokenService: TokenService,
  ) {}
  // TODO : createBySignUpDto in user service !!!!!!
  async signUp(signUpDto: SignUpDto) {
    const user = await this.prisma.user.create({
      data: {
        email: signUpDto.email,
        fullName: signUpDto.fullname,
        password: await this.hashingService.hash(signUpDto.password),
        userName: signUpDto.username,
        profile: {
          create: {},
        },
      },
    });
    return this.tokenService.getJwtToken(user);
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.findByUsername(signInDto.username);
    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!user || !isEqual) throw new UnauthorizedException();
    return this.tokenService.getJwtToken(user);
  }
}
