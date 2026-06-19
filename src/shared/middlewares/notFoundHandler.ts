import type { RequestHandler } from 'express';
import { sendError } from '../http.js';

export const notFoundHandler: RequestHandler = (req, res) => {
  return sendError(res, {
    statusCode: 404,
    code: 'ROUTE_NOT_FOUND',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};
