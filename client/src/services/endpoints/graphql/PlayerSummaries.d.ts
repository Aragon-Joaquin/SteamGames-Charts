const PlayerStatus = {
  Offline: 'offline',
  Online: 'online',
  Away: 'away',
  Snooze: 'snooze',
  LookingToTrade: 'looking_to_trade',
  LookingToPlay: 'looking_to_play',
} as const;

export type PlayerSummariesType = {
  steamid: string;
  persona_state: (typeof PlayerStatus)[keyof typeof PlayerStatus];
  persona_name: string;
  profile_url: string;
  avatarfull?: string;
  lastlogoff: number;
};
