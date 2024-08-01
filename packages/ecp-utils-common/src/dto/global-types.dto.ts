import { z } from 'nestjs-zod/z';

export const AppTypeSchema = z.enum([
  'APP_AI',
  'HOSTING',
  'PLUGIN',
  'APP_STRATTIC',
  'APP_IO',
  'APP_BKP',
  'DISCOUNT',
  'APP_SERVICE',
  'APP_EMPMA',
  'APP_SUPPORT',
  'APP_MAILER',
]);
