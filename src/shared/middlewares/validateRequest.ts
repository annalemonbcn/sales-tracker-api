import type { RequestHandler } from 'express';
import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const requestSchema = z.object({
  body: z.unknown().optional(),
  params: z.unknown().optional(),
  query: z.unknown().optional(),
});

type RequestSchema = z.ZodType<z.infer<typeof requestSchema>>;

export const validateRequest =
  (schema: RequestSchema): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      next(result.error);
      return;
    }

    if (result.data.body !== undefined) {
      req.body = result.data.body;
    }

    next();
  };
