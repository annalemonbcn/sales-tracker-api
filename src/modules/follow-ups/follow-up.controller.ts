import type { RequestHandler } from 'express';

import { sendSuccess } from '../../shared/http.js';
import { followUpService } from './follow-up.service.js';
import { toFollowUpDto } from './follow-up.mapper.js';
import type { GetBusinessFollowUpsParams } from './follow-up.schemas.js';

export const getBusinessFollowUps: RequestHandler = async (_req, res, next) => {
  try {
    const params = res.locals.validated.params as GetBusinessFollowUpsParams;

    const followUps = await followUpService.getBusinessFollowUps(params);

    return sendSuccess(res, {
      followUps: followUps.map(toFollowUpDto),
    });
  } catch (error) {
    next(error);
  }
};
