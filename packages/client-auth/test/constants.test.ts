import { describe, it, expect } from 'vitest';
import { SUPABASE_AUTH } from '../src/constants';

describe('constants', () => {
  it('SUPABASE_AUTH should exist', () => {
    expect(SUPABASE_AUTH).toBeDefined();
  });
  it('SUPABASE_AUTH should have the minimum required properties', () => {
    expect(SUPABASE_AUTH).toHaveProperty('HASH');
    expect(SUPABASE_AUTH).toHaveProperty('ERROR');
    expect(SUPABASE_AUTH.HASH).toHaveProperty('EMAIL_CHANGE');
    expect(SUPABASE_AUTH.HASH).toHaveProperty('LINK_EXPIRED');
    expect(SUPABASE_AUTH.ERROR).toHaveProperty('EMAIL_ALREADY_SENT');
  });
});
