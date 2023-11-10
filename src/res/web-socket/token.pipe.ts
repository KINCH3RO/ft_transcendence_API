import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenPipe implements PipeTransform {
  constructor(private jwtService: JwtService) {}
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.token != undefined) {
      value['sender'] = this.jwtService.verify(value.token, {
        secret: process.env.JWT_SECRET,
      });
      value['sender']['id'] = value['sender'].sub;
      delete value['sender'].sub;
      delete value.token;
    }
    return value;
  }
}
