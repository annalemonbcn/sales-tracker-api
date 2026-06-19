import type { RequestHandler } from 'express';
import { sendSuccess } from '../../shared/http.js';
import { userService } from './user.service.js';
import { toUserDto } from './user.mapper.js';

export const getUsers: RequestHandler = async (_req, res, next) => {
  try {
    const users = await userService.getUsers();

    return sendSuccess(res, {
      users: users.map(toUserDto),
    });
  } catch (error) {
    next(error);
  }
};
