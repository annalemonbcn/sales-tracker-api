# Technical Notes

Observations and potential next steps identified during the project review.

## Architectural Opportunities

- Introduce authentication and obtain the acting user from the authenticated
  session instead of accepting user identifiers in request bodies.
- Implement the application module and API for the `Contact` model, which
  already exists in Prisma.
- Add service tests and HTTP integration tests backed by a test database.
- Add database indexes for business, activity, and follow-up fields frequently
  used for filtering and sorting.
- Stop using `Business.createdById` as the implicit author of later changes and
  record the user who actually performs each action.
- Define and document how the derived fields `Business.lastContactedAt` and
  `Business.nextFollowUpAt` are recalculated and kept consistent.
- Complete the repository separation in the users module.
