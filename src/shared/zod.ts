import { type ZodError } from 'zod';

type ValidationErrorDetails = Record<string, string[]>;

export const formatZodError = (error: ZodError): ValidationErrorDetails => {
  const fieldErrors: ValidationErrorDetails = {};

  for (const issue of error.issues) {
    const path = issue.path;
    const fieldName = path[0] === 'body' ? path[1] : path[0];

    if (!fieldName) {
      continue;
    }

    const key = String(fieldName)

    fieldErrors[key] ??= [];
    fieldErrors[key].push(issue.message);
  }

  return fieldErrors;
};
