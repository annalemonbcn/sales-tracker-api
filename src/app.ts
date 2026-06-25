import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';
import { userRouter } from './modules/users/user.routes.js';
import { businessRouter } from './modules/businesses/business.routes.js';
import { notFoundHandler } from './shared/middlewares/notFoundHandler.js';
import { errorHandler } from './shared/middlewares/errorHandler.js';
import { activityRouter } from './modules/activities/activity.routes.js';
import { followUpRouter } from './modules/follow-ups/follow-up.routes.js';
import { businessFollowUpRouter } from './modules/follow-ups/business-follow-up.routes.js';
import { dashboardRouter } from './modules/dashboard/dashboard.routes.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Sales Tracker API is running',
  });
});

app.get('/openapi.json', (_req, res) => {
  res.json(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/users', userRouter);
app.use('/businesses', businessRouter);
app.use('/businesses/:businessId/activities', activityRouter);
app.use('/businesses/:businessId/follow-ups', businessFollowUpRouter);
app.use('/follow-ups', followUpRouter);
app.use('/dashboard', dashboardRouter);

app.use(notFoundHandler);
app.use(errorHandler);
