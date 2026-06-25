import { Router } from 'express';

import { validateRequest } from '../../shared/middlewares/validateRequest.js';
import {
  cancelFollowUp,
  getFollowUps,
  markFollowUpDone,
  updateFollowUp,
} from './follow-up.controller.js';
import {
  cancelFollowUpSchema,
  getFollowUpsSchema,
  markFollowUpDoneSchema,
  updateFollowUpSchema,
} from './follow-up.schemas.js';

export const followUpRouter = Router();

followUpRouter.get('/', validateRequest(getFollowUpsSchema), getFollowUps);

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
