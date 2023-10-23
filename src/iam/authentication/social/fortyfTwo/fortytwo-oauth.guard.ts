import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FortytwoOAuthGuard extends AuthGuard('42') {
  constructor() {
    super({});
  }
}
