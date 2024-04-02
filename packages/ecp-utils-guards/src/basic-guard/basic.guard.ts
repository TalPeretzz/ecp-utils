import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BASIC_STRATEGY_NAME } from './basic.constants';

@Injectable()
export class BasicGuard extends AuthGuard(BASIC_STRATEGY_NAME) {}
