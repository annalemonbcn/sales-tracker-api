import { Router } from 'express';
import { validateRequest } from '../../shared/middlewares/validateRequest.js';
import { createBusinessSchema, getBusinessesSchema } from './business.schemas.js';
import { createBusiness, getBusinesses } from './business.controller.js';

export const businessRouter = Router();

businessRouter.get('/', validateRequest(getBusinessesSchema), getBusinesses);

businessRouter.post('/', validateRequest(createBusinessSchema), createBusiness);
