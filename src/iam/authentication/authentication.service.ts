import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/res/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    private prisma: PrismaService,
    private hashingService: HashingService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    return this.prisma.user.create({
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
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.findByUsername(signInDto.username);
    if (!user || this.hashingService.compare(user.password, signInDto.password))
      throw new UnauthorizedException();
    const payload = { sub: user.id, username: user.userName };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
