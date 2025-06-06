export type AllGraphQLEndpoints =
  | 'GameDetails'
  | 'UserOwnedGames'
  | 'PlayerSummaries'
  | 'FriendList'
  | 'RecentGames'
  | 'SchemaForGame'
  | 'AchievementPercentages'
  | 'PlayerBans';

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

export const GRAPHQL_FIELDS: Record<getGraphqlEndpoints, string[]> = {
  getAchievementPercentages: [],
  getFriendList: [],
  getGameDetails: [],
  getPlayerBans: [],
  getPlayerSummaries: [],
  getRecentGames: [],
  getSchemaForGame: [],
  getUserOwnedGames: [],
} as const;
