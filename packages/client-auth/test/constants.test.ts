import { describe, it, expect } from 'vitest';
import { SUPABASE_AUTH } from '../src/provider/constants';
import { AUTH_ROUTES } from '../src/router/constants';

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
  it('AUTH_ROUTES should exist', () => {
    expect(AUTH_ROUTES).toBeDefined();
  });
  it('AUTH_ROUTES should have the minimum required properties', () => {
    expect(AUTH_ROUTES).toHaveProperty('LOGIN');
    expect(AUTH_ROUTES).toHaveProperty('SIGNUP');
    expect(AUTH_ROUTES).toHaveProperty('FORGOT_PASSWORD');
    expect(AUTH_ROUTES).toHaveProperty('NEW_PASSWORD');
    expect(AUTH_ROUTES).toHaveProperty('CREATE_PROFILE');
    expect(AUTH_ROUTES).toHaveProperty('PROFILE');
  });
});
