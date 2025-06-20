import {
  getGraphqlEndpoints,
  GQL_INT64,
  GRAPHQL_ENDPOINTS,
  GRAPHQL_VARIABLES_NAME,
  GraphQLIDTypes,
} from '../../GRAPHQLendpoints';
import {
  AchievementPercentagesStringified,
  FriendListStringified,
  GameDetailsStringified,
  PlayerBansStringified,
  PlayerSummariesStringified,
  RecentGamesStringified,
  SchemaForGameStringified,
  UserOwnedGamesStringified,
} from '../index';

export interface IQueryGraphQL<T extends getGraphqlEndpoints> {
  GQLQuery: string;
  Variables: {
    [key in T]: GraphQLIDTypes<(typeof GRAPHQL_VARIABLES_NAME)[key]>;
  };
  Types: `$${T}: ${GraphQLIDTypes<
    (typeof GRAPHQL_VARIABLES_NAME)[T]
  > extends GQL_INT64
    ? 'ID!'
    : '[ID!]!'}`;
}

//! single endpoint makers
type HashmapGQLType = {
  getGameDetails: (
    steam_appid: GQL_INT64
  ) => IQueryGraphQL<typeof GRAPHQL_ENDPOINTS.GameDetails>;
  getUserOwnedGames: (
    steamid: GQL_INT64
  ) => IQueryGraphQL<typeof GRAPHQL_ENDPOINTS.UserOwnedGames>;
  getPlayerSummaries: (
    steamids: GQL_INT64[]
  ) => IQueryGraphQL<typeof GRAPHQL_ENDPOINTS.PlayerSummaries>;
  getFriendList: (
    steamid: GQL_INT64
  ) => IQueryGraphQL<typeof GRAPHQL_ENDPOINTS.FriendList>;
  getRecentGames: (
    steamid: GQL_INT64
  ) => IQueryGraphQL<typeof GRAPHQL_ENDPOINTS.RecentGames>;
  getSchemaForGame: (
    appid: GQL_INT64
  ) => IQueryGraphQL<typeof GRAPHQL_ENDPOINTS.SchemaForGame>;
  getAchievementPercentages: (
    gameid: GQL_INT64
  ) => IQueryGraphQL<typeof GRAPHQL_ENDPOINTS.AchievementPercentages>;
  getPlayerBans: (
    steamids: GQL_INT64[]
  ) => IQueryGraphQL<typeof GRAPHQL_ENDPOINTS.PlayerBans>;
};

export const GQLQUERIES: HashmapGQLType = {
  getGameDetails: (steam_appid) => ({
    GQLQuery: `getGameDetails(steam_appid: $${GRAPHQL_ENDPOINTS.GameDetails}) {
              ${GameDetailsStringified}
              }`,
    Variables: { getGameDetails: steam_appid },
    Types: `$${GRAPHQL_ENDPOINTS.GameDetails}: ID!`,
  }),

  getUserOwnedGames: (steamid) => ({
    GQLQuery: `getUserOwnedGames(steamid: $${GRAPHQL_ENDPOINTS.UserOwnedGames}) {
                ${UserOwnedGamesStringified}
                }`,
    Variables: { getUserOwnedGames: steamid },
    Types: `$${GRAPHQL_ENDPOINTS.UserOwnedGames}: ID!`,
  }),

  getPlayerSummaries: (steamids) => ({
    GQLQuery: `getPlayerSummaries(steamids: $${GRAPHQL_ENDPOINTS.PlayerSummaries}) {
                ${PlayerSummariesStringified}
              }`,
    Variables: { getPlayerSummaries: steamids },
    Types: `$${GRAPHQL_ENDPOINTS.PlayerSummaries}: [ID!]!`,
  }),

  getFriendList: (steamid) => ({
    GQLQuery: `getFriendList(steamid: $${GRAPHQL_ENDPOINTS.FriendList}) {
                ${FriendListStringified}
              }`,
    Variables: { getFriendList: steamid },
    Types: `$${GRAPHQL_ENDPOINTS.FriendList}: ID!`,
  }),

  getRecentGames: (steamid) => ({
    GQLQuery: `getRecentGames(steamid: $${GRAPHQL_ENDPOINTS.RecentGames}) {
                ${RecentGamesStringified}
              }`,
    Variables: { getRecentGames: steamid },
    Types: `$${GRAPHQL_ENDPOINTS.RecentGames}: ID!`,
  }),

  getSchemaForGame: (appid) => ({
    GQLQuery: `getSchemaForGame(appid: $${GRAPHQL_ENDPOINTS.SchemaForGame}) {
                ${SchemaForGameStringified}
              }`,
    Variables: { getSchemaForGame: appid },
    Types: `$${GRAPHQL_ENDPOINTS.SchemaForGame}: ID!`,
  }),

  getAchievementPercentages: (gameid) => ({
    GQLQuery: `getAchievementPercentages(gameid: $${GRAPHQL_ENDPOINTS.AchievementPercentages}) {
                ${AchievementPercentagesStringified}
              }`,
    Variables: { getAchievementPercentages: gameid },
    Types: `$${GRAPHQL_ENDPOINTS.AchievementPercentages}: ID!`,
  }),

  getPlayerBans: (steamids) => ({
    GQLQuery: `getPlayerBans(steamids: $${GRAPHQL_ENDPOINTS.PlayerBans}) {
                ${PlayerBansStringified}
              }`,
    Variables: { getPlayerBans: steamids },
    Types: `$${GRAPHQL_ENDPOINTS.PlayerBans}: [ID!]!`,
  }),
} as const;
