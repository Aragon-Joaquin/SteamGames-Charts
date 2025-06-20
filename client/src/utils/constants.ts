export const SERVER_URL = 'http://localhost:8080';
export const STEAM_ID_DIGITS = 17 as const;
export const MIN_VANITYURL = 3 as const;

export const MakeEndpoint = (end: string) => `${SERVER_URL}${end ?? '/'}`;

export const RoundDecimals = (val: number) => Math.round(val * 100) / 100;

export const removeWhiteSpace = (val: string) => val.replace(/ /g, '');

export const numberFormat = (val: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 1,
  }).format(val);

/**
 * @returns TRUE if window DOESN'T exist
 */
export const IsWindowUndefined = () =>
  typeof globalThis === 'undefined' || typeof window === 'undefined';
