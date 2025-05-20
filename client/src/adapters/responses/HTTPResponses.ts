export type SearchUserResponse = {
  response: {
    players: Array<{
      steamid: string;
      persona_name: string | '';
      profile_url: string | '';
      avatarfull: string;
      lastlogoff: number;
    }>;
  };
};
