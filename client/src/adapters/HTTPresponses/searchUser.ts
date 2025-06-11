import { UNIX_RESPONSES } from '../../utils';

export type SearchUserResponse = {
  response: {
    players: Array<{
      steamid: string;
      personastate: number;
      personaname: string | '';
      profileurl: string | '';
      avatarfull: string;
      lastlogoff: number;
    }>;
  };
};

export type SearchUserAdapted = {
  steamid: string;
  state: (typeof USER_STATES)[keyof typeof USER_STATES];
  persona_name: string | '';
  profile_url: string | '';
  avatarfull: string;
  lastlogoff: UNIX_RESPONSES;
};

export const USER_STATES = {
  0: 'Offline',
  1: 'Online',
  2: 'Busy',
  3: 'Away',
  4: 'Snooze',
  5: 'Looking to trade',
  6: 'Looking to play',
} as const;

export type ALL_USER_STATES = (typeof USER_STATES)[keyof typeof USER_STATES];
