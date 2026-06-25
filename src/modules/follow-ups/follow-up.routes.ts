import { Router } from 'express';

import { validateRequest } from '../../shared/middlewares/validateRequest.js';
import {
  cancelFollowUp,
  createFollowUp,
  getBusinessFollowUps,
  markFollowUpDone,
  updateFollowUp,
} from './follow-up.controller.js';
import {
  cancelFollowUpSchema,
  createFollowUpSchema,
  getBusinessFollowUpsSchema,
  markFollowUpDoneSchema,
  updateFollowUpSchema,
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

followUpRouter.patch(
  '/:followUpId',
  validateRequest(updateFollowUpSchema),
  updateFollowUp,
);

followUpRouter.patch(
  '/:followUpId/done',
  validateRequest(markFollowUpDoneSchema),
  markFollowUpDone,
);

followUpRouter.patch(
  '/:followUpId/cancel',
  validateRequest(cancelFollowUpSchema),
  cancelFollowUp,
);
