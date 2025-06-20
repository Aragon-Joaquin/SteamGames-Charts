import { AdaptedGraphqlTypes } from '../../adapters/graphqlAdapter';

export interface DashboardStateType {
  GameDetails: AdaptedGraphqlTypes<'getGameDetails'> | null;
  UserOwnedGames: AdaptedGraphqlTypes<'getUserOwnedGames'> | null;
  PlayerSummaries: AdaptedGraphqlTypes<'getPlayerSummaries'> | null;
  FriendList: AdaptedGraphqlTypes<'getFriendList'> | null;
  RecentGames: AdaptedGraphqlTypes<'getRecentGames'> | null;
  SchemaForGame: AdaptedGraphqlTypes<'getSchemaForGame'> | null;
  AchievementPercentages: AdaptedGraphqlTypes<'getAchievementPercentages'> | null;
  PlayerBans: AdaptedGraphqlTypes<'getPlayerBans'> | null;
}

// not sure what i meant by datastream but lgtm 👍
export const CONTEXT_DATASTREAM_NAME = {
  usersMap: 'C_Users',
  DashboardState: 'DashB_State',
} as const;

export type CONTEXT_KEYNAMES =
  (typeof CONTEXT_DATASTREAM_NAME)[keyof typeof CONTEXT_DATASTREAM_NAME];
