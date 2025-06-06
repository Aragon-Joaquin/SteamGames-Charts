export const HTTPPaths = {
  searchUser: '/search/user',
  totalUsers: '/search/totalUsers',
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

//* EXPORT AS TYPES
const getRoutes = [HTTPPaths.totalUsers] as const;
export type GETHTTPType = (typeof getRoutes)[number];

const postRoutes = [HTTPPaths.searchUser] as const;
export type POSTHTTPType = (typeof postRoutes)[number];
