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
        DashboardMetricTrendVariant: {
          type: 'string',
          enum: ['success', 'warning', 'danger', 'neutral'],
          example: 'success',
        },

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
            trendVariant: {
              $ref: '#/components/schemas/DashboardMetricTrendVariant',
            },
          },
          required: ['value', 'currentMonth', 'trendVariant'],
        },

        UserSummaryDto: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            name: {
              type: 'string',
              example: 'Anna',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'anna@example.com',
            },
            role: {
              type: 'string',
              example: 'admin',
            },
          },
          required: ['id', 'name', 'email', 'role'],
        },

        UserDto: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            name: {
              type: 'string',
              example: 'Anna',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'anna@example.com',
            },
            role: {
              type: 'string',
              example: 'admin',
            },
            active: {
              type: 'boolean',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-06-25T10:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-06-25T10:30:00.000Z',
            },
          },
          required: [
            'id',
            'name',
            'email',
            'role',
            'active',
            'createdAt',
            'updatedAt',
          ],
        },

        BusinessDetailsDto: {
          type: 'object',
          properties: {
            instagram: {
              type: 'string',
              nullable: true,
              example: '@bella_hair_studio',
            },
            email: {
              type: 'string',
              nullable: true,
              format: 'email',
              example: 'hello@bellahair.com',
            },
            phone: {
              type: 'string',
              nullable: true,
              example: '+34 600 123 456',
            },
            website: {
              type: 'string',
              nullable: true,
              format: 'uri',
              example: 'https://bellahair.com',
            },
            address: {
              type: 'string',
              nullable: true,
              example: 'Carrer de Mallorca 123, Barcelona',
            },
          },
          required: ['instagram', 'email', 'phone', 'website', 'address'],
        },

        BusinessStatus: {
          type: 'string',
          enum: [
            'new_lead',
            'assigned',
            'waiting_response',
            'interested',
            'dossier_sent',
            'meeting_scheduled',
            'meeting_done',
            'proposal_sent',
            'negotiating',
            'won',
            'lost',
            'recontact_later',
            'discarded',
          ],
          example: 'waiting_response',
        },

        Category: {
          type: 'string',
          enum: [
            'restaurant',
            'hairdresser',
            'beauty_center',
            'hotel',
            'shop',
            'gym',
            'clinic',
            'other',
          ],
          example: 'hairdresser',
        },

        Priority: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          example: 'high',
        },

        LeadSource: {
          type: 'string',
          enum: [
            'instagram',
            'google_maps',
            'walk_in',
            'referral',
            'website',
            'existing_contact',
            'other',
          ],
          example: 'instagram',
        },

        BusinessDto: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '660e8400-e29b-41d4-a716-446655440000',
            },
            name: {
              type: 'string',
              example: 'Bella Hair Studio',
            },
            category: {
              $ref: '#/components/schemas/Category',
            },
            status: {
              $ref: '#/components/schemas/BusinessStatus',
            },
            priority: {
              $ref: '#/components/schemas/Priority',
            },
            source: {
              $ref: '#/components/schemas/LeadSource',
            },
            details: {
              $ref: '#/components/schemas/BusinessDetailsDto',
            },
            notes: {
              type: 'string',
              nullable: true,
              example: 'Interested in receiving the commercial dossier.',
            },
            lastContactedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: '2026-06-25T10:00:00.000Z',
            },
            nextFollowUpAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: '2026-07-05T10:00:00.000Z',
            },
            createdBy: {
              $ref: '#/components/schemas/UserSummaryDto',
            },
            assignedTo: {
              nullable: true,
              allOf: [
                {
                  $ref: '#/components/schemas/UserSummaryDto',
                },
              ],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-06-25T10:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-06-25T10:30:00.000Z',
            },
          },
          required: [
            'id',
            'name',
            'category',
            'status',
            'priority',
            'source',
            'details',
            'notes',
            'lastContactedAt',
            'nextFollowUpAt',
            'createdBy',
            'assignedTo',
            'createdAt',
            'updatedAt',
          ],
        },

        CreateBusinessRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Bella Hair Studio',
            },
            category: {
              type: 'string',
              example: 'hairdresser',
            },
            source: {
              type: 'string',
              example: 'instagram',
            },
            priority: {
              type: 'string',
              example: 'high',
            },
            instagram: {
              type: 'string',
              example: '@bella_hair_studio',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'hello@bellahair.com',
            },
            phone: {
              type: 'string',
              example: '+34 600 123 456',
            },
            website: {
              type: 'string',
              format: 'uri',
              example: 'https://bellahair.com',
            },
            address: {
              type: 'string',
              example: 'Carrer de Mallorca 123, Barcelona',
            },
            notes: {
              type: 'string',
              example: 'Interested lead from Instagram.',
            },
            createdById: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            assignedToId: {
              type: 'string',
              format: 'uuid',
              example: '660e8400-e29b-41d4-a716-446655440000',
            },
          },
          required: ['name', 'category', 'source', 'createdById'],
        },

        UpdateBusinessRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Bella Hair Studio Updated',
            },
            category: {
              type: 'string',
              example: 'hairdresser',
            },
            status: {
              type: 'string',
              example: 'interested',
            },
            source: {
              type: 'string',
              example: 'instagram',
            },
            priority: {
              type: 'string',
              example: 'high',
            },
            instagram: {
              type: 'string',
              example: '@bella_hair_studio',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'hello@bellahair.com',
            },
            phone: {
              type: 'string',
              example: '+34 600 123 456',
            },
            website: {
              type: 'string',
              format: 'uri',
              example: 'https://bellahair.com',
            },
            address: {
              type: 'string',
              example: 'Carrer de Mallorca 123, Barcelona',
            },
            notes: {
              type: 'string',
              example: 'Updated internal notes.',
            },
            assignedToId: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              example: '660e8400-e29b-41d4-a716-446655440000',
            },
          },
          description:
            'At least one field is required. assignedToId can be null to unassign the business.',
        },

        ActivityDto: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '770e8400-e29b-41d4-a716-446655440000',
            },
            type: {
              type: 'string',
              example: 'instagram_message_sent',
            },
            notes: {
              type: 'string',
              nullable: true,
              example:
                'Le he escrito por Instagram preguntando si quiere recibir el dossier.',
            },
            metadata: {
              type: 'object',
              nullable: true,
              additionalProperties: true,
              example: {
                channel: 'instagram',
              },
            },
            user: {
              $ref: '#/components/schemas/UserSummaryDto',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-06-25T10:00:00.000Z',
            },
          },
          required: ['id', 'type', 'notes', 'metadata', 'user', 'createdAt'],
        },

        CreateActivityRequest: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: [
                'instagram_message_sent',
                'email_sent',
                'phone_call_done',
                'visit_done',
                'response_received',
                'dossier_sent',
                'meeting_scheduled',
                'meeting_done',
                'proposal_sent',
                'note_added',
              ],
              example: 'instagram_message_sent',
              description:
                'Manual activity type. System activity types such as business_created, status_changed or priority_changed are not allowed here.',
            },
            userId: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
              description:
                'Temporary field until auth is implemented. Later this will come from req.user.id.',
            },
            notes: {
              type: 'string',
              example:
                'Le he escrito por Instagram preguntando si quiere recibir el dossier.',
            },
            metadata: {
              type: 'object',
              additionalProperties: true,
              example: {
                channel: 'instagram',
              },
            },
          },
          required: ['type', 'userId'],
        },

        FollowUpDto: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '770e8400-e29b-41d4-a716-446655440000',
            },
            status: {
              type: 'string',
              enum: ['pending', 'done', 'cancelled'],
              example: 'pending',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-05T10:00:00.000Z',
            },
            note: {
              type: 'string',
              nullable: true,
              example:
                'Call the business to check if they received the dossier.',
            },
            completedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: null,
            },
            assignedTo: {
              $ref: '#/components/schemas/UserSummaryDto',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-06-25T10:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-06-25T10:30:00.000Z',
            },
          },
          required: [
            'id',
            'status',
            'dueDate',
            'note',
            'completedAt',
            'assignedTo',
            'createdAt',
            'updatedAt',
          ],
        },

        FollowUpBusinessDto: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '660e8400-e29b-41d4-a716-446655440000',
            },
            name: {
              type: 'string',
              example: 'Bella Hair Studio',
            },
            category: {
              type: 'string',
              example: 'hairdresser',
            },
            status: {
              type: 'string',
              example: 'waiting_response',
            },
            priority: {
              type: 'string',
              example: 'high',
            },
          },
          required: ['id', 'name', 'category', 'status', 'priority'],
        },

        FollowUpTaskDto: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '770e8400-e29b-41d4-a716-446655440000',
            },
            status: {
              type: 'string',
              enum: ['pending', 'done', 'cancelled'],
              example: 'pending',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-05T10:00:00.000Z',
            },
            note: {
              type: 'string',
              nullable: true,
              example:
                'Call the business to check if they received the dossier.',
            },
            completedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: null,
            },
            assignedTo: {
              $ref: '#/components/schemas/UserSummaryDto',
            },
            business: {
              $ref: '#/components/schemas/FollowUpBusinessDto',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-06-25T10:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-06-25T10:30:00.000Z',
            },
          },
          required: [
            'id',
            'status',
            'dueDate',
            'note',
            'completedAt',
            'assignedTo',
            'business',
            'createdAt',
            'updatedAt',
          ],
        },

        CreateFollowUpRequest: {
          type: 'object',
          properties: {
            assignedToId: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-05T10:00:00.000Z',
            },
            note: {
              type: 'string',
              example:
                'Call the business to check if they received the dossier.',
            },
          },
          required: ['assignedToId', 'dueDate'],
        },

        UpdateFollowUpRequest: {
          type: 'object',
          properties: {
            assignedToId: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-08T12:00:00.000Z',
            },
            note: {
              type: 'string',
              example: 'Visit the business in person.',
            },
          },
          description:
            'At least one field is required. Only assignedToId, dueDate and note can be updated from this endpoint.',
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
