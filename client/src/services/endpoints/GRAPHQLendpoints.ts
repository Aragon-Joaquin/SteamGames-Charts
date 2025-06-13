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

//! the steamid is int64 and the standard only supports upto 2^53 (IEEE 754 Double-Precision Floating-Point Numbers)
//! BigInt doesnt work with JSON.stringify nor Number()/ParseInt() cuz it looses precision.
export type GQL_INT64 = string;

export type AllGraphQLIDs =
  | 'steam_appid'
  | 'steamid'
  | 'steamids'
  | 'appid'
  | 'gameid';

export type GraphQLIDTypes<T extends AllGraphQLIDs> = T extends 'steamids'
  ? GQL_INT64[]
  : GQL_INT64;

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

//! this is the worst i've done. refactor later please <3
export const GRAPHQL_VARIABLES_NAME = {
  getGameDetails: 'steam_appid',
  getUserOwnedGames: 'steamid',
  getPlayerSummaries: 'steamids',
  getFriendList: 'steamid',
  getRecentGames: 'steamid',
  getSchemaForGame: 'appid',
  getAchievementPercentages: 'gameid',
  getPlayerBans: 'steamids',
} as const;

export type getGraphqlEndpoints =
  (typeof GRAPHQL_ENDPOINTS)[keyof typeof GRAPHQL_ENDPOINTS];
