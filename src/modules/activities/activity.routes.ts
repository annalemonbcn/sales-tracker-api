import { Router } from 'express';

import { validateRequest } from '../../shared/middlewares/validateRequest.js';
import { getBusinessActivitiesSchema } from './activity.schemas.js';
import { getBusinessActivities } from './activity.controller.js';

export const activityRouter = Router({
  mergeParams: true,
});

activityRouter.get(
  '/',
  validateRequest(getBusinessActivitiesSchema),
  getBusinessActivities,
);
