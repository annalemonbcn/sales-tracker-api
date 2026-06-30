import type { RequestHandler } from 'express';
import { sendSuccess } from '../../shared/http.js';
import type {
  CreateBusinessInput,
  GetBusinessByIdParams,
  GetBusinessesQuery,
  UpdateBusinessInput,
  UpdateBusinessParams,
} from './business.schemas.js';
import { businessService } from './business.service.js';
import { toBusinessDetailDto, toBusinessDto } from './business.mapper.js';

export const getBusiness: RequestHandler = async (_req, res, next) => {
  try {
    const params = res.locals.validated.params as GetBusinessByIdParams;

    const business = await businessService.getBusinessById(params);

    return sendSuccess(res, {
      business: toBusinessDetailDto(business),
    });
  } catch (error) {
    next(error);
  }
};

export const getBusinesses: RequestHandler = async (_req, res, next) => {
  try {
    const query = res.locals.validated.query as GetBusinessesQuery;

    const businesses = await businessService.getBusinesses(query);

    return sendSuccess(res, { businesses: businesses.map(toBusinessDto) });
  } catch (error) {
    next(error);
  }
};

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

export const updateBusiness: RequestHandler = async (req, res, next) => {
  try {
    const params = res.locals.validated.params as UpdateBusinessParams;
    const data = req.body as UpdateBusinessInput;

    const business = await businessService.updateBusiness(params, data);

    return sendSuccess(res, {
      business: toBusinessDetailDto(business),
    });
  } catch (error) {
    next(error);
  }
};
