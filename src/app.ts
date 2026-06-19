import express from 'express';
import cors from 'cors';
import { userRouter } from './modules/users/user.routes.js';
import { notFoundHandler } from './shared/middlewares/notFoundHandler.js';
import { errorHandler } from './shared/middlewares/errorHandler.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Sales Tracker API is running',
  });
});

app.use('/users', userRouter);

app.use(notFoundHandler);
app.use(errorHandler);
