import { Router } from 'express';

import { validateRequest } from '../../shared/middlewares/validateRequest.js';
import { getBusinessFollowUps } from './follow-up.controller.js';
import { getBusinessFollowUpsSchema } from './follow-up.schemas.js';

export const followUpRouter = Router({
  mergeParams: true,
});

followUpRouter.get(
  '/',
  validateRequest(getBusinessFollowUpsSchema),
  getBusinessFollowUps,
);
