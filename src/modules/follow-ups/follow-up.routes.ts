import { Router } from 'express';

import { validateRequest } from '../../shared/middlewares/validateRequest.js';
import {
  cancelFollowUp,
  markFollowUpDone,
  updateFollowUp,
} from './follow-up.controller.js';
import {
  cancelFollowUpSchema,
  markFollowUpDoneSchema,
  updateFollowUpSchema,
} from './follow-up.schemas.js';

export const followUpRouter = Router();

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
