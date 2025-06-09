export type RecentGamesType = {
  total_count: number;
  games: Array<{
    appid: number;
    name: string;
    playtime_2weeks?: number;
    playtime_forever?: number;
    img_icon_url?: string;
    playtime_windows_forever?: number;
    playtime_mac_forever?: number;
    playtime_linux_forever?: number;
    playtime_deck_forever?: number;
  }>;
};
export const RecentGamesStringified = `
  total_count
  games {
    appid
    name
    playtime_2weeks
    playtime_forever
    img_icon_url
    playtime_windows_forever
    playtime_mac_forever
    playtime_linux_forever
    playtime_deck_forever
  }
` as const;
