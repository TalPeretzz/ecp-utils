import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { STORES_KEY } from './elementor-store.decorator';
import { ElementorStoreType } from './elementor-store.enum';

@Injectable()
export class ElementorStoreGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredStore = this.reflector.getAllAndOverride<ElementorStoreType[]>(STORES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredStore) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<FastifyRequest>();
    const hasAccess = user?.elementorStore && requiredStore.includes(user.elementorStore);

    // if (!hasAccess) {
    //   this.logger.warn(`Access denied. The elementorStore claim is set to: ${user?.elementorStore}`);
    // }

    return hasAccess;
  }
}
