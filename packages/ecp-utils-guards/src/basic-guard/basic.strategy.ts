import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicVerifyFunction, BasicStrategy as Strategy } from 'passport-http';
import { BasicModuleToken, BasicOptionsType } from './basic-guard.module-definition';
import { BASIC_STRATEGY_NAME } from './basic.constants';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, BASIC_STRATEGY_NAME) {
  constructor(@Inject(BasicModuleToken) private readonly option: BasicOptionsType) {
    const verify: BasicVerifyFunction = (username, password, done) => {
      const isValidUser = username === option.username && password === option.password;
      return done(null, isValidUser);
    };

    super(verify);
  }
}
