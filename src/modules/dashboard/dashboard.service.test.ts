import { describe, expect, it } from 'vitest';

import { getStartOfCurrentMonth } from './dashboard.service.js';

describe('getStartOfCurrentMonth', () => {
  it('returns the first day of the current month at midnight UTC', () => {
    const date = new Date('2026-06-25T15:30:45.000Z');

    const result = getStartOfCurrentMonth(date);

    expect(result.toISOString()).toBe('2026-06-01T00:00:00.000Z');
  });

  it('works for January', () => {
    const date = new Date('2026-01-15T10:00:00.000Z');

    const result = getStartOfCurrentMonth(date);

    expect(result.toISOString()).toBe('2026-01-01T00:00:00.000Z');
  });

  it('works for December', () => {
    const date = new Date('2026-12-31T23:59:59.000Z');

    const result = getStartOfCurrentMonth(date);

    expect(result.toISOString()).toBe('2026-12-01T00:00:00.000Z');
  });
});
