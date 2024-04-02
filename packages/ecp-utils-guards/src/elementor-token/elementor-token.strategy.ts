import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithSecret } from 'passport-jwt';
import { ELEMENTOR_TOKEN_STRATEGY_NAME } from './elementor-token.constants';
import { ElementorTokenClaims } from './elementor-token.guard.types';
import { ElementorTokenModuleToken, ElementorTokenOptionsType } from './elementor-token.module-definition';

@Injectable()
export class ElementorTokenStrategy extends PassportStrategy(Strategy, ELEMENTOR_TOKEN_STRATEGY_NAME) {
  constructor(@Inject(ElementorTokenModuleToken) private readonly option: ElementorTokenOptionsType) {
    const options: StrategyOptionsWithSecret = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: option.secretOrKey,
      algorithms: option.algorithms || ['RS256'],
      issuer: option.issuer,
    };

    super(options);
  }

  validate(payload: ElementorTokenClaims) {
    return payload;
  }
}
