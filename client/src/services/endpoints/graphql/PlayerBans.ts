export type PlayerBansType = {
  players: Array<{
    SteamId: string;
    CommunityBanned: boolean;
    VACBanned: boolean;
    NumberOfVACBans: number;
    DaysSinceLastBan: number;
    NumberOfGameBans: number;
    EconomyBan: string;
  }>;
};

export const PlayerBansStringified = `
  players {
    SteamId
    CommunityBanned
    VACBanned
    NumberOfVACBans
    DaysSinceLastBan
    NumberOfGameBans
    EconomyBan
  }

` as const;
