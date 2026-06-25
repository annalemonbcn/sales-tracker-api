import { Router } from 'express';
import { getUsers } from './user.controller.js';

export const userRouter = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get users
 *     description: Returns all users.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Users returned successfully
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
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserDto'
 *               required:
 *                 - success
 *                 - data
 */
userRouter.get('/', getUsers);
