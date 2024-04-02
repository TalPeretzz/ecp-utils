import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ELEMENTOR_TOKEN_STRATEGY_NAME } from './elementor-token.constants';

@Injectable()
export class ElementorTokenGuard extends AuthGuard(ELEMENTOR_TOKEN_STRATEGY_NAME) {}
