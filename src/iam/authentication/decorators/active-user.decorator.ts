import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const ActiveUser = createParamDecorator((field: string, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req['user'];
  return user;
});
