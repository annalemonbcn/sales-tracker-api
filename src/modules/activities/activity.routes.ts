import { Router } from 'express';

import { validateRequest } from '../../shared/middlewares/validateRequest.js';
import {
  createActivitySchema,
  getBusinessActivitiesSchema,
} from './activity.schemas.js';
import {
  createActivity,
  getBusinessActivities,
} from './activity.controller.js';

export const activityRouter = Router({
  mergeParams: true,
});

activityRouter.get(
  '/',
  validateRequest(getBusinessActivitiesSchema),
  getBusinessActivities,
);

activityRouter.post('/', validateRequest(createActivitySchema), createActivity);
