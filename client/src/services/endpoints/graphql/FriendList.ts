export type FriendListType = {
  friends: Array<{
    steamid: string;
    relationship: string;
    friends_since: number;
  }>;
};

export const FriendListStringified = `
  friends {
    steamid
    relationship
    friends_since
  }
` as const;
