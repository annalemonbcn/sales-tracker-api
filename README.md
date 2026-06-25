# Sales Tracker API

Backend API for **Sales Tracker**, a CRM-style application designed to manage business leads, commercial activity, follow-up tasks, and dashboard metrics.

This API provides the core backend for tracking businesses through a sales pipeline, registering interactions, scheduling follow-ups, and exposing summary data for a frontend dashboard.

## Features

### Business Management

- Create new business leads.
- List businesses with filters.
- Retrieve a single business by ID.
- Update business information.
- Assign businesses to users.
- Track business status, priority, category, source, contact details, notes, and follow-up dates.

Supported business fields include:

- Name
- Category
- Status
- Priority
- Source
- Instagram
- Email
- Phone
- Website
- Address
- Notes
- Assigned user
- Last contacted date
- Next follow-up date

### Activity Timeline

Each business has an activity timeline.

Supported activity features:

- List activities for a business.
- Create manual activities.
- Automatically create system activities when key business events happen.

Examples of activity types:

- `business_created`
- `business_assigned`
- `instagram_message_sent`
- `email_sent`
- `phone_call_done`
- `visit_done`
- `response_received`
- `dossier_sent`
- `meeting_scheduled`
- `meeting_done`
- `proposal_sent`
- `status_changed`
- `priority_changed`
- `follow_up_created`
- `follow_up_updated`
- `follow_up_done`
- `follow_up_cancelled`
- `note_added`

Some manual activities automatically update the linked business. For example:

- Contact activities update `lastContactedAt`.
- Some activity types update the business status.
- Status changes create a `status_changed` activity.

### Follow-up Tasks

Follow-ups represent future tasks linked to a business.

Examples:

- Call a business next week.
- Visit a business at a scheduled time.
- Send a reminder after a proposal.
- Check whether a business received the dossier.

Supported follow-up features:

- List follow-ups for a specific business.
- Create follow-ups for a business.
- Update follow-up `dueDate`, `assignedToId`, and `note`.
- Mark follow-ups as done.
- Cancel follow-ups.
- List follow-ups globally for a Tasks view.

The global follow-up endpoint supports filters by:

- Status
- Assigned user
- Linked business
- Linked business priority
- Due date range

The API also keeps `business.nextFollowUpAt` updated so the frontend can quickly display the next pending task for each business.

### Dashboard Summary

The API exposes a dashboard summary endpoint with key metrics for the dashboard cards.

Current metrics include:

- Total businesses
- Businesses created in the current month
- Contacted businesses
- Businesses contacted in the current month
- Pending follow-ups
- Pending follow-ups created in the current month
- High priority businesses
- High priority businesses created in the current month

### Users

Basic user listing is available.

Users are used to:

- Create businesses.
- Assign businesses.
- Assign follow-ups.
- Register activity ownership.

Authentication is not implemented yet. Some endpoints temporarily receive `userId` or `assignedToId` from the request body until real auth is added.

### Validation and Error Handling

The API uses Zod for request validation.

Validation is applied to:

- Params
- Query strings
- Request bodies

The API returns consistent success and error responses.

Success response format:

```json
{
  "success": true,
  "data": {}
}
```

Error response format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {}
  }
}
```

### Swagger Documentation

Swagger UI is available at:

```txt
/api-docs
```

The documentation includes the main API endpoints and reusable response/request schemas.

## Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma
- Zod
- Vitest
- Swagger UI
- Docker for local PostgreSQL

## Project Structure

```txt
src/
  app.ts
  server.ts

  config/
    env.ts

  docs/
    swagger.ts

  generated/
    prisma/

  shared/
    errors.ts
    http.ts
    prisma.ts
    zod.ts
    middlewares/
      errorHandler.ts
      notFoundHandler.ts
      validateRequest.ts

  modules/
    users/
    businesses/
    activities/
    follow-ups/
    dashboard/
```

## Main API Endpoints

### Health

```txt
GET /health
```

### Users

```txt
GET /users
```

### Businesses

```txt
GET    /businesses
GET    /businesses/:businessId
POST   /businesses
PATCH  /businesses/:businessId
```

### Activities

```txt
GET   /businesses/:businessId/activities
POST  /businesses/:businessId/activities
```

### Business Follow-ups

```txt
GET   /businesses/:businessId/follow-ups
POST  /businesses/:businessId/follow-ups
```

### Global Follow-ups / Tasks

```txt
GET    /follow-ups
PATCH  /follow-ups/:followUpId
PATCH  /follow-ups/:followUpId/done
PATCH  /follow-ups/:followUpId/cancel
```

### Dashboard

```txt
GET /dashboard/summary
```

## Environment Variables

Create a `.env` file based on `.env.example`.

Example:

```env
DATABASE_URL="postgresql://sales_user:sales_password@localhost:5432/sales_tracker?schema=public"
PORT=3000
```

## Installation

```bash
npm install
```

## Run PostgreSQL with Docker

```bash
docker compose up -d
```

## Run Prisma Migrations

```bash
npx prisma migrate dev
```

## Generate Prisma Client

```bash
npx prisma generate
```

## Seed Database

```bash
npx prisma db seed
```

## Run Development Server

```bash
npm run dev
```

The API will be available at:

```txt
http://localhost:3000
```

Swagger documentation will be available at:

```txt
http://localhost:3000/api-docs
```

## Run Tests

```bash
npm test
```

## Testing

The project includes unit tests for:

- Zod validation helpers
- Request schemas
- DTO mappers
- Prisma data builders
- Dashboard summary mapper
- Date helpers
- Business update logic
- Activity logic
- Follow-up logic

Integration tests with a dedicated test database are planned for a future phase.

## Current Limitations

This is an API MVP. The following items are intentionally left for future iterations:

- Real authentication with JWT.
- Using `req.user.id` instead of passing user IDs in request bodies.
- Role-based permissions.
- Integration tests with a test database.
- Pagination.
- Configurable sorting.
- More advanced business status automation.
- More nuanced `response_received` rules.
- Production deployment configuration.

## Status

API MVP completed.

The backend is ready to be consumed by the Sales Tracker frontend.
