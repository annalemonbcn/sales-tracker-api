import { Router } from 'express';

import { getDashboardSummary } from './dashboard.controller.js';

export const dashboardRouter = Router();

/**
 * @openapi
 * /dashboard/summary:
 *   get:
 *     summary: Get dashboard summary
 *     description: Returns dashboard metric cards summary.
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Dashboard summary returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     metrics:
 *                       type: object
 *                       properties:
 *                         totalBusinesses:
 *                           $ref: '#/components/schemas/DashboardMetric'
 *                         contactedBusinesses:
 *                           $ref: '#/components/schemas/DashboardMetric'
 *                         pendingFollowUps:
 *                           $ref: '#/components/schemas/DashboardMetric'
 *                         highPriorityBusinesses:
 *                           $ref: '#/components/schemas/DashboardMetric'
 */
dashboardRouter.get('/summary', getDashboardSummary);
