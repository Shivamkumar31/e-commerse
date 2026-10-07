/** Central place for env-based settings so no other file reads process.env directly. */
export const API_URL = process.env.API_URL ?? 'http://localhost:4000';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
export const SITE_NAME = 'mettā muse';
