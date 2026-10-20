import { describe, expect, it } from 'vitest';
import { getSafeRedirect } from './safeRedirect';

describe('getSafeRedirect', () => {
  it('accepts an allowlisted internal route only', () => {
    expect(getSafeRedirect('/dashboard', 'https://example.test')).toBe('/dashboard');
  });

  it.each([
    'https://attacker.test',
    '//attacker.test',
    '/dashboard/settings',
    '/dashboard?accountId=private',
    'javascript:alert(1)',
    '/%zz',
  ])('falls back for %s', (value) => {
    expect(getSafeRedirect(value, 'https://example.test')).toBe('/dashboard');
  });
});
