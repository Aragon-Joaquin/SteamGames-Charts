type PlaytimePlatformsTypes = {
  linux: number;
  mac: number;
  windows: number;
};

export type UserOwnedGamesType = {
  games_count: number;
  games: Array<{
    appid: string;
    name: string;
    img_icon_url?: string;
    playtime_forever: number;
    playtime_platforms: PlaytimePlatformsTypes;
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
	      playtime_platforms
	      rtime_last_played
    }` as const;
