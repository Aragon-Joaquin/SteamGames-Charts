//! graphql
export const GRAPHQL_ENDPOINTS = {
  GetPlayerData: 'getPlayerData',
  GetFriends: 'getFriends',
  GetStats: 'getStats',
} as const;

//! http routes
export const HTTPPaths = {
  searchUser: '/search/user',
} as const;

//* METHODS*
export const SEARCH_USER = (args: {
  VanityUrl: string;
}): Record<string, string> => {
  return {
    VanityUrl: args.VanityUrl ?? '',
  };
};

//* EXPORT EVERYTHING*
export const POSTHTTPRoutes = {
  [HTTPPaths.searchUser]: {
    createBody: SEARCH_USER,
  },
};
