import type { RequestHandler } from 'express';
import { z } from 'zod';

type ParsedRequest = {
  body?: unknown;
  params?: unknown;
  query?: unknown;
};

export const validateRequest =
  (schema: z.ZodType<ParsedRequest>): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      next(result.error);
      return;
    }

    res.locals.validated = result.data;

    if (result.data.body !== undefined) {
      req.body = result.data.body;
    }

    next();
  };
