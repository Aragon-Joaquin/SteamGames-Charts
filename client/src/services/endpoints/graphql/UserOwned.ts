export type UserOwnedGamesType = {
  game_count: number;
  games: Array<{
    appid: string;
    name: string;
    img_icon_url?: string;
    playtime_forever: number;
    playtime_windows_forever: number;
    playtime_mac_forever: number;
    playtime_linux_forever: number;
    rtime_last_played: number;
  }>;
};

export const UserOwnedGamesStringified = `
    game_count
	  games {
      	appid
	      name
	      img_icon_url
	      playtime_forever
        playtime_windows_forever
        playtime_mac_forever
        playtime_linux_forever
	      rtime_last_played
    }` as const;
