import { ElementorTokenClaims } from '../elementor-token/elementor-token.guard.types';

declare module 'fastify' {
  interface FastifyRequest {
    user: ElementorTokenClaims;
  }
}
