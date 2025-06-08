type PlaytimePlatformsTypes = {
  linux: number;
  mac: number;
  windows: number;
};

export type UserOwnedGamesType = {
  appid: string;
  name: string;
  img_icon_url?: string;
  playtime_forever: number;
  playtime_platforms: PlaytimePlatformsTypes;
  rtime_last_played: number;
};
