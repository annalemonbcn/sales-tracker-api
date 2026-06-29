import { Router } from 'express';
import { validateRequest } from '../../shared/middlewares/validateRequest.js';
import {
  createBusinessSchema,
  getBusinessByIdSchema,
  getBusinessesSchema,
  updateBusinessSchema,
} from './business.schemas.js';
import {
  createBusiness,
  getBusiness,
  getBusinesses,
  updateBusiness,
} from './business.controller.js';

export const businessRouter = Router();

/**
 * @openapi
 * /businesses:
 *   get:
 *     operationId: getBusinesses
 *     summary: Get businesses
 *     description: Returns businesses with optional filters.
 *     tags:
 *       - Businesses
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by business status.
 *         example: waiting_response
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by business category.
 *         example: hairdresser
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *         description: Filter by business priority.
 *         example: high
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: Filter by lead source.
 *         example: instagram
 *       - in: query
 *         name: assignedToId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by assigned user.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by business name, instagram, email, phone or address.
 *         example: Bella
 *     responses:
 *       200:
 *         description: Businesses returned successfully
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
 *                     businesses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/BusinessDto'
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
businessRouter.get('/', validateRequest(getBusinessesSchema), getBusinesses);

/**
 * @openapi
 * /businesses/{businessId}:
 *   get:
 *     summary: Get business by ID
 *     description: Returns a single business by its ID.
 *     tags:
 *       - Businesses
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
 *         description: Business returned successfully
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
 *                     business:
 *                       $ref: '#/components/schemas/BusinessDetailDto'
 *                   required:
 *                     - business
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
businessRouter.get(
  '/:businessId',
  validateRequest(getBusinessByIdSchema),
  getBusiness,
);

/**
 * @openapi
 * /businesses:
 *   post:
 *     summary: Create business
 *     description: Creates a new business and automatically creates business_created activity. If assignedToId is provided, the business starts as assigned and business_assigned activity is also created.
 *     tags:
 *       - Businesses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBusinessRequest'
 *     responses:
 *       201:
 *         description: Business created successfully
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
 *                     business:
 *                       $ref: '#/components/schemas/BusinessDto'
 *               required:
 *                 - success
 *                 - data
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Created by user or assigned user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
businessRouter.post('/', validateRequest(createBusinessSchema), createBusiness);

/**
 * @openapi
 * /businesses/{businessId}:
 *   patch:
 *     summary: Update business
 *     description: Updates a business. If status changes, a status_changed activity is created. If priority changes, a priority_changed activity is created. If assignedToId changes, a business_assigned activity is created.
 *     tags:
 *       - Businesses
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
 *             $ref: '#/components/schemas/UpdateBusinessRequest'
 *     responses:
 *       200:
 *         description: Business updated successfully
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
 *                     business:
 *                       $ref: '#/components/schemas/BusinessDetailDto'
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
businessRouter.patch(
  '/:businessId',
  validateRequest(updateBusinessSchema),
  updateBusiness,
);
