import type { RequestHandler } from 'express';

import { sendSuccess } from '../../shared/http.js';
import { followUpService } from './follow-up.service.js';
import { toFollowUpDto, toFollowUpTaskDto } from './follow-up.mapper.js';
import type {
  CancelFollowUpParams,
  CreateFollowUpInput,
  CreateFollowUpParams,
  GetBusinessFollowUpsParams,
  GetFollowUpsQuery,
  MarkFollowUpDoneParams,
  UpdateFollowUpInput,
  UpdateFollowUpParams,
} from './follow-up.schemas.js';

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

export const getFollowUps: RequestHandler = async (_req, res, next) => {
  try {
    const query = res.locals.validated.query as GetFollowUpsQuery;

    const followUps = await followUpService.getFollowUps(query);

    return sendSuccess(res, {
      followUps: followUps.map(toFollowUpTaskDto),
    });
  } catch (error) {
    next(error);
  }
};

export const createFollowUp: RequestHandler = async (req, res, next) => {
  try {
    const params = res.locals.validated.params as CreateFollowUpParams;
    const data = req.body as CreateFollowUpInput;

    const followUp = await followUpService.createFollowUp(params, data);

    return sendSuccess(
      res,
      {
        followUp: toFollowUpDto(followUp),
      },
      201,
    );
  } catch (error) {
    next(error);
  }
};

export const markFollowUpDone: RequestHandler = async (_req, res, next) => {
  try {
    const params = res.locals.validated.params as MarkFollowUpDoneParams;

    const followUp = await followUpService.markFollowUpDone(params);

    return sendSuccess(res, {
      followUp: toFollowUpDto(followUp),
    });
  } catch (error) {
    next(error);
  }
};

export const cancelFollowUp: RequestHandler = async (_req, res, next) => {
  try {
    const params = res.locals.validated.params as CancelFollowUpParams;

    const followUp = await followUpService.cancelFollowUp(params);

    return sendSuccess(res, {
      followUp: toFollowUpDto(followUp),
    });
  } catch (error) {
    next(error);
  }
};

export const updateFollowUp: RequestHandler = async (req, res, next) => {
  try {
    const params = res.locals.validated.params as UpdateFollowUpParams;
    const data = req.body as UpdateFollowUpInput;

    const followUp = await followUpService.updateFollowUp(params, data);

    return sendSuccess(res, {
      followUp: toFollowUpDto(followUp),
    });
  } catch (error) {
    next(error);
  }
};
