export const SUPABASE_AUTH = {
  HASH: {
    EMAIL_CHANGE:
      '#message=Confirmation+link+accepted.+Please+proceed+to+confirm+link+sent+to+the+other+email',
    LINK_EXPIRED:
      '#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired',
  },
  ERROR: {
    EMAIL_ALREADY_SENT: 'For security purposes, you can only request this after',
  },
} as const;
