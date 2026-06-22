import type { RequestHandler } from 'express';
import { sendSuccess } from '../../shared/http.js';

export const createBusiness: RequestHandler = (req, res) => {
  return sendSuccess(
    res,
    {
      business: req.body,
    },
    201
  );
};