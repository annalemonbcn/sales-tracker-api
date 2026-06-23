import type { RequestHandler } from 'express';

import { sendSuccess } from '../../shared/http.js';
import { activityService } from './activity.service.js';
import { toActivityDto } from './activity.mapper.js';
import type {
  CreateActivityInput,
  CreateActivityParams,
  GetBusinessActivitiesParams,
} from './activity.schemas.js';

export const getBusinessActivities: RequestHandler = async (
  _req,
  res,
  next,
) => {
  try {
    const params = res.locals.validated.params as GetBusinessActivitiesParams;

    const activities = await activityService.getBusinessActivities(params);

    return sendSuccess(res, {
      activities: activities.map(toActivityDto),
    });
  } catch (error) {
    next(error);
  }
};

export const createActivity: RequestHandler = async (req, res, next) => {
  try {
    const params = res.locals.validated.params as CreateActivityParams;
    const data = req.body as CreateActivityInput;

    const activity = await activityService.createActivity(params, data);

    return sendSuccess(
      res,
      {
        activity: toActivityDto(activity),
      },
      201,
    );
  } catch (error) {
    next(error);
  }
};
