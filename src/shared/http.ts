import type { Response } from 'express';

export const sendSuccess = <T>(res: Response, data: T, statusCode = 200) =>
  res.status(statusCode).json({
    success: true,
    data,
  });

type ErrorParams = {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
};

export const sendError = (res: Response, params: ErrorParams) =>
  res.status(params.statusCode).json({
    success: false,
    error: {
      code: params.code,
      message: params.message,
      ...(params.details ? { details: params.details } : {}),
    },
  });
