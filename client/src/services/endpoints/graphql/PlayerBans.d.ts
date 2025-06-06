export type PlayerBans = {
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
