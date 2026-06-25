import express from 'express';
import cors from 'cors';
import { userRouter } from './modules/users/user.routes.js';
import { businessRouter } from './modules/businesses/business.routes.js';
import { notFoundHandler } from './shared/middlewares/notFoundHandler.js';
import { errorHandler } from './shared/middlewares/errorHandler.js';
import { activityRouter } from './modules/activities/activity.routes.js';
import { followUpRouter } from './modules/follow-ups/follow-up.routes.js';

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
app.use('/businesses', businessRouter);
app.use('/businesses/:businessId/activities', activityRouter);
// TODO: separate in 2 routers?
app.use('/businesses/:businessId/follow-ups', followUpRouter);
app.use('/follow-ups', followUpRouter);

app.use(notFoundHandler);
app.use(errorHandler);
