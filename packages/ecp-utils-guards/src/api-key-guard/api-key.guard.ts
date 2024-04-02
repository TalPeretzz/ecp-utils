import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { API_KEY_STRATEGY_NAME } from './api-key.constants';

@Injectable()
export class ApiKeyGuard extends AuthGuard(API_KEY_STRATEGY_NAME) {}
