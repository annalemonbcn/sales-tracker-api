import { Router } from 'express';
import { validateRequest } from '../../shared/middlewares/validateRequest.js';
import {
  createBusinessSchema,
  getBusinessByIdSchema,
  getBusinessesSchema,
  updateBusinessSchema,
} from './business.schemas.js';
import {
  createBusiness,
  getBusiness,
  getBusinesses,
  updateBusiness,
} from './business.controller.js';

export const businessRouter = Router();

businessRouter.get('/', validateRequest(getBusinessesSchema), getBusinesses);

businessRouter.get(
  '/:businessId',
  validateRequest(getBusinessByIdSchema),
  getBusiness,
);

businessRouter.post('/', validateRequest(createBusinessSchema), createBusiness);

businessRouter.patch(
  '/:businessId',
  validateRequest(updateBusinessSchema),
  updateBusiness,
);
