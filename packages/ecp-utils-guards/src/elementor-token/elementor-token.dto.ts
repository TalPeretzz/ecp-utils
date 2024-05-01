import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const ElementorTokenClaimsSchema = z
  .object({
    // The required claims should be declared by the user of this code.
    sub: z.union([z.string(), z.number()]),
  })
  .passthrough()
  .transform((data) => {
    return {
      ...data,
      userId: data.sub.toString(),
    };
  });

export class ElementorTokenClaimsDto extends createZodDto(ElementorTokenClaimsSchema) {}
