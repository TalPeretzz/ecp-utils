import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { API_KEY_STRATEGY_NAME } from './api-key.constants';
import { ApiKeyModuleToken, ApiKeyOptionsType } from './api-key.module-definition';

type Result = Record<string, string> | null;

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, API_KEY_STRATEGY_NAME) {
  constructor(@Inject(ApiKeyModuleToken) private readonly option: ApiKeyOptionsType) {
    super(
      { header: 'Authorization', prefix: '' },
      true,
      (apiKey: string, verified: (err: Error | null, result: Result) => void) => {
        if (apiKey === option.apiKey) {
          return verified(null, { elementorStore: 'ecp' });
        }
        return verified(new UnauthorizedException(), null);
      },
    );
  }
}
