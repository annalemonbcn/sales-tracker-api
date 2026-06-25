import type { RequestHandler } from 'express';

import { sendSuccess } from '../../shared/http.js';
import { dashboardService } from './dashboard.service.js';

export const getDashboardSummary: RequestHandler = async (_req, res, next) => {
  try {
    const summary = await dashboardService.getSummary();

    return sendSuccess(res, summary);
  } catch (error) {
    next(error);
  }
};
