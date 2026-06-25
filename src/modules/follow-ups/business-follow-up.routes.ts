import { Router } from 'express';

import { validateRequest } from '../../shared/middlewares/validateRequest.js';
import {
  createFollowUpSchema,
  getBusinessFollowUpsSchema,
} from './follow-up.schemas.js';
import {
  createFollowUp,
  getBusinessFollowUps,
} from './follow-up.controller.js';

export const businessFollowUpRouter = Router({
  mergeParams: true,
});

/**
 * @openapi
 * /businesses/{businessId}/follow-ups:
 *   get:
 *     summary: Get business follow-ups
 *     description: Returns follow-ups linked to a specific business.
 *     tags:
 *       - Follow-ups
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
 *         description: Follow-ups returned successfully
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
 *                     followUps:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/FollowUpDto'
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
businessFollowUpRouter.get(
  '/',
  validateRequest(getBusinessFollowUpsSchema),
  getBusinessFollowUps,
);

/**
 * @openapi
 * /businesses/{businessId}/follow-ups:
 *   post:
 *     summary: Create business follow-up
 *     description: Creates a follow-up task for a specific business. It also creates a follow_up_created activity and updates business.nextFollowUpAt when the new task is the nearest pending follow-up.
 *     tags:
 *       - Follow-ups
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
 *             $ref: '#/components/schemas/CreateFollowUpRequest'
 *     responses:
 *       201:
 *         description: Follow-up created successfully
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
 *                     followUp:
 *                       $ref: '#/components/schemas/FollowUpDto'
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
 *         description: Business or assigned user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
businessFollowUpRouter.post(
  '/',
  validateRequest(createFollowUpSchema),
  createFollowUp,
);
