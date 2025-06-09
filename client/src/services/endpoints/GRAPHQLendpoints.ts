import {
  AchievementPercentagesType,
  FriendListType,
  GameDetailsType,
  PlayerBansType,
  PlayerSummariesType,
  RecentGamesType,
  SchemaForGameType,
  UserOwnedGamesType,
} from './graphql';

export type AllGraphQLEndpoints =
  | 'GameDetails'
  | 'UserOwnedGames'
  | 'PlayerSummaries'
  | 'FriendList'
  | 'RecentGames'
  | 'SchemaForGame'
  | 'AchievementPercentages'
  | 'PlayerBans';

export type AllGraphQLIDs =
  | 'steam_appid'
  | 'steamid'
  | 'steamids'
  | 'appid'
  | 'gameid';

export type GraphQLResponses =
  | AchievementPercentagesType
  | FriendListType
  | GameDetailsType
  | PlayerSummariesType
  | PlayerBansType
  | RecentGamesType
  | SchemaForGameType
  | UserOwnedGamesType;

type GetEndpoints<T extends AllGraphQLEndpoints> = {
  [K in T]: `get${K}`;
};

export const GRAPHQL_ENDPOINTS: GetEndpoints<AllGraphQLEndpoints> = {
  GameDetails: 'getGameDetails',
  UserOwnedGames: 'getUserOwnedGames',
  PlayerSummaries: 'getPlayerSummaries',
  FriendList: 'getFriendList',
  RecentGames: 'getRecentGames',
  SchemaForGame: 'getSchemaForGame',
  AchievementPercentages: 'getAchievementPercentages',
  PlayerBans: 'getPlayerBans',
} as const;

export type getGraphqlEndpoints =
  (typeof GRAPHQL_ENDPOINTS)[keyof typeof GRAPHQL_ENDPOINTS];
