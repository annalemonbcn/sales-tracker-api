import { Router } from 'express';
import { validateRequest } from '../../shared/middlewares/validateRequest.js';
import { createBusinessSchema } from './business.schemas.js';
import { createBusiness } from './business.controller.js';

export const businessRouter = Router();

businessRouter.post('/', validateRequest(createBusinessSchema), createBusiness);