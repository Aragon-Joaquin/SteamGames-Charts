export type PlayerSummariesType = {
  players: Array<{
    steamid: string;
    personastate: number;
    personaname: string;
    profileurl: string;
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
