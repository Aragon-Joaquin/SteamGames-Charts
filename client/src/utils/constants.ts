export const SERVER_URL = 'http://localhost:3000';
export const STEAM_ID_DIGITS = 17 as const;
export const MIN_VANITYURL = 3 as const;

export const MakeEndpoint = (end: string) => `${SERVER_URL}${end ?? '/'}`;
