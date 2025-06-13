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

//! the three standing out are different as the ones typed... yeah im dumb i dont wanna rename all of this to adapted types
export const PlayerSummariesStringified = `
players {
  steamid
  		personaname
  		personastate
  		profileurl
  avatarfull
  lastlogoff
}
` as const;
