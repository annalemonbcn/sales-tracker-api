import { Router } from 'express';

import { validateRequest } from '../../shared/middlewares/validateRequest.js';
import {
  createFollowUp,
  getBusinessFollowUps,
} from './follow-up.controller.js';
import {
  createFollowUpSchema,
  getBusinessFollowUpsSchema,
} from './follow-up.schemas.js';

export const followUpRouter = Router({
  mergeParams: true,
});

followUpRouter.get(
  '/',
  validateRequest(getBusinessFollowUpsSchema),
  getBusinessFollowUps,
);

followUpRouter.post('/', validateRequest(createFollowUpSchema), createFollowUp);
