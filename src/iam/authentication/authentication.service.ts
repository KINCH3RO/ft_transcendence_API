import { Injectable,UnauthorizedException  } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';

@Injectable()
export class AuthenticationService {
	constructor( private prisma: PrismaService, private hashingService : HashingService ) {}

	async signUp(signUpDto : SignUpDto ) {

	}

	async signIn (signInDto : SignInDto) {

	}
}
