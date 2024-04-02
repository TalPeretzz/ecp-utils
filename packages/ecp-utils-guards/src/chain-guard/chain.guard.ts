import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { API_KEY_STRATEGY_NAME } from '../api-key-guard/api-key.constants';
import { ELEMENTOR_TOKEN_STRATEGY_NAME } from '../elementor-token/elementor-token.constants';
import { IS_PUBLIC_KEY } from './chain.constants';

@Injectable()
export class ChainAuthGuard extends PassportAuthGuard([ELEMENTOR_TOKEN_STRATEGY_NAME, API_KEY_STRATEGY_NAME]) {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
