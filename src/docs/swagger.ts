import swaggerJSDoc from 'swagger-jsdoc';
import type { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sales Tracker API',
      version: '1.0.0',
      description: 'API documentation for the Sales Tracker backend',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server',
      },
    ],
    tags: [
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Businesses',
        description: 'Business management endpoints',
      },
      {
        name: 'Activities',
        description: 'Business activity timeline endpoints',
      },
      {
        name: 'Follow-ups',
        description: 'Follow-up and task management endpoints',
      },
      {
        name: 'Dashboard',
        description: 'Dashboard summary endpoints',
      },
    ],
    components: {
      schemas: {
        DashboardMetric: {
          type: 'object',
          properties: {
            value: {
              type: 'number',
              example: 148,
            },
            currentMonth: {
              type: 'number',
              example: 12,
            },
          },
          required: ['value', 'currentMonth'],
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR',
                },
                message: {
                  type: 'string',
                  example: 'Invalid request data',
                },
                details: {
                  type: 'object',
                  nullable: true,
                },
              },
              required: ['code', 'message'],
            },
          },
          required: ['success', 'error'],
        },
      },
    },
  },
  apis: ['src/modules/**/*.routes.ts'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
