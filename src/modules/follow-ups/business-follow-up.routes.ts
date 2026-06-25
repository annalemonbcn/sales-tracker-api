import { Router } from 'express';

import { validateRequest } from '../../shared/middlewares/validateRequest.js';
import {
  createFollowUpSchema,
  getBusinessFollowUpsSchema,
} from './follow-up.schemas.js';
import {
  createFollowUp,
  getBusinessFollowUps,
} from './follow-up.controller.js';

export const businessFollowUpRouter = Router({
  mergeParams: true,
});

businessFollowUpRouter.get(
  '/',
  validateRequest(getBusinessFollowUpsSchema),
  getBusinessFollowUps,
);

businessFollowUpRouter.post(
  '/',
  validateRequest(createFollowUpSchema),
  createFollowUp,
);
