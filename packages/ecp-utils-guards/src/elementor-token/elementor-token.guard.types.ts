import { JwtPayload } from 'jsonwebtoken';

export type ElementorTokenGuardOptions = {
  issuer: string;
  secretOrKey: string;
};

export type ElementorTokenClaims = JwtPayload & Partial<{ email: string; name: string }>;
