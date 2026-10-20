import { describe, expect, it } from 'vitest';
import { ar } from './ar';
import { en } from './en';

describe('translations', () => {
  it('has identical English and Arabic keys', () => {
    expect(Object.keys(ar).sort()).toEqual(Object.keys(en).sort());
  });
});
