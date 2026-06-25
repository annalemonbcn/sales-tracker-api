import { Router } from 'express';

import { validateRequest } from '../../shared/middlewares/validateRequest.js';
import {
  cancelFollowUp,
  getFollowUps,
  markFollowUpDone,
  updateFollowUp,
} from './follow-up.controller.js';
import {
  cancelFollowUpSchema,
  getFollowUpsSchema,
  markFollowUpDoneSchema,
  updateFollowUpSchema,
} from './follow-up.schemas.js';

export const followUpRouter = Router();

/**
 * @openapi
 * /follow-ups:
 *   get:
 *     summary: Get follow-ups
 *     description: Returns global follow-ups with optional filters. This endpoint is used by the Tasks view.
 *     tags:
 *       - Follow-ups
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, done, cancelled]
 *         description: Filter by follow-up status.
 *         example: pending
 *       - in: query
 *         name: assignedToId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by assigned user.
 *       - in: query
 *         name: businessId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by linked business.
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter by linked business priority.
 *         example: high
 *       - in: query
 *         name: dueBefore
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter follow-ups due before or at this date.
 *         example: 2026-07-10T00:00:00.000Z
 *       - in: query
 *         name: dueAfter
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter follow-ups due after or at this date.
 *         example: 2026-07-01T00:00:00.000Z
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
 *                         $ref: '#/components/schemas/FollowUpTaskDto'
 *               required:
 *                 - success
 *                 - data
 *       400:
 *         description: Invalid query params
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
followUpRouter.get('/', validateRequest(getFollowUpsSchema), getFollowUps);

/**
 * @openapi
 * /follow-ups/{followUpId}:
 *   patch:
 *     summary: Update follow-up
 *     description: Updates a follow-up task. Only assignedToId, dueDate and note can be updated. Updating dueDate creates a follow_up_updated activity and may recalculate business.nextFollowUpAt.
 *     tags:
 *       - Follow-ups
 *     parameters:
 *       - in: path
 *         name: followUpId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Follow-up ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFollowUpRequest'
 *     responses:
 *       200:
 *         description: Follow-up updated successfully
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
 *         description: Follow-up or assigned user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
followUpRouter.patch(
  '/:followUpId',
  validateRequest(updateFollowUpSchema),
  updateFollowUp,
);

/**
 * @openapi
 * /follow-ups/{followUpId}/done:
 *   patch:
 *     summary: Mark follow-up as done
 *     description: Marks a follow-up as done, sets completedAt, creates a follow_up_done activity and recalculates business.nextFollowUpAt.
 *     tags:
 *       - Follow-ups
 *     parameters:
 *       - in: path
 *         name: followUpId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Follow-up ID.
 *     responses:
 *       200:
 *         description: Follow-up marked as done successfully
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
 *         description: Invalid followUpId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Follow-up not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
followUpRouter.patch(
  '/:followUpId/done',
  validateRequest(markFollowUpDoneSchema),
  markFollowUpDone,
);

/**
 * @openapi
 * /follow-ups/{followUpId}/cancel:
 *   patch:
 *     summary: Cancel follow-up
 *     description: Cancels a follow-up, creates a follow_up_cancelled activity and recalculates business.nextFollowUpAt.
 *     tags:
 *       - Follow-ups
 *     parameters:
 *       - in: path
 *         name: followUpId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Follow-up ID.
 *     responses:
 *       200:
 *         description: Follow-up cancelled successfully
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
 *         description: Invalid followUpId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Follow-up not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
followUpRouter.patch(
  '/:followUpId/cancel',
  validateRequest(cancelFollowUpSchema),
  cancelFollowUp,
);
