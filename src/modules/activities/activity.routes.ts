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

/**
 * @openapi
 * /businesses/{businessId}/activities:
 *   get:
 *     summary: Get business activities
 *     description: Returns the activity timeline for a specific business.
 *     tags:
 *       - Activities
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Business ID.
 *     responses:
 *       200:
 *         description: Activities returned successfully
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
 *                     activities:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ActivityDto'
 *               required:
 *                 - success
 *                 - data
 *       400:
 *         description: Invalid businessId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Business not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
activityRouter.get(
  '/',
  validateRequest(getBusinessActivitiesSchema),
  getBusinessActivities,
);

/**
 * @openapi
 * /businesses/{businessId}/activities:
 *   post:
 *     summary: Create manual activity
 *     description: Creates a manual activity for a business. Some activity types automatically update the business status or lastContactedAt.
 *     tags:
 *       - Activities
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Business ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateActivityRequest'
 *     responses:
 *       201:
 *         description: Activity created successfully
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
 *                     activity:
 *                       $ref: '#/components/schemas/ActivityDto'
 *               required:
 *                 - success
 *                 - data
 *       400:
 *         description: Invalid request params or body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Business or user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
activityRouter.post('/', validateRequest(createActivitySchema), createActivity);
