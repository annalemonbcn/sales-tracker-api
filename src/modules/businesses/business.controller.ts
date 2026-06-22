import type { RequestHandler } from 'express';
import { sendSuccess } from '../../shared/http.js';
import type { CreateBusinessInput } from './business.schemas.js';
import { businessService } from './business.service.js';
import { toBusinessDto } from './business.mapper.js';

export const createBusiness: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body as CreateBusinessInput;

    const business = await businessService.createBusiness(data);

    return sendSuccess(
      res,
      {
        business: toBusinessDto(business),
      },
      201,
    );
  } catch (error) {
    next(error);
  }
};
