export type PlayerSummariesType = {
  players: Array<{
    steamid: string;
    persona_state: number;
    persona_name: string;
    profile_url: string;
    avatarfull?: string;
    lastlogoff: number;
  }>;
};

export const PlayerSummariesStringified = `
players {
  steamid
  persona_state
  persona_names
  profile_url
  avatarfull
  lastlogoff
}
` as const;
