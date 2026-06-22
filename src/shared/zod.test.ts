import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { formatZodError } from './zod.js';

describe('formatZodError', () => {
  it('formats Zod body validation errors into a flat object', () => {
    const schema = z.object({
      body: z.object({
        name: z.string().min(1, 'Business name is required'),
        email: z.email('Invalid email'),
        createdById: z.uuid('Invalid createdById'),
      }),
    });

    const result = schema.safeParse({
      body: {
        name: '',
        email: 'not-an-email',
        createdById: 'invalid-id',
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(formatZodError(result.error)).toEqual({
        name: ['Business name is required'],
        email: ['Invalid email'],
        createdById: ['Invalid createdById'],
      });
    }
  });

  it('returns an empty object when there are no field paths', () => {
    const schema = z.string();

    const result = schema.safeParse(123);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(formatZodError(result.error)).toEqual({});
    }
  });
});