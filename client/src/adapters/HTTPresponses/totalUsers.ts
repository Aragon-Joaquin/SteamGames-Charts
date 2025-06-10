import { UNIX_RESPONSES } from '../../utils';

export type totalUsersResponse = {
  response: {
    last_update: number;
    Ranks: Array<{
      rank: number;
      appid: number;
      concurrent_in_game: number;
      peak_in_game: number;
    }>;
  };
};

export type totalUsersAdapted = {
  last_update: UNIX_RESPONSES;
  Ranks: Array<{
    rank: number;
    appid: number;
    concurrent_in_game: number;
    peak_in_game: number;
  }>;
};
