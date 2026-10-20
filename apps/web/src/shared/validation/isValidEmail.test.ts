import { describe, expect, it } from 'vitest';
import { isValidEmail } from './isValidEmail';

describe('isValidEmail', () => {
  it('accepts a valid address with surrounding whitespace', () => {
    expect(isValidEmail('  user@example.com  ')).toBe(true);
  });

  it.each(['', 'not-an-email', 'user@', 'user@example', 'user name@example.com'])(
    'rejects %s',
    (value) => {
      expect(isValidEmail(value)).toBe(false);
    },
  );
});
