import { HTTPPaths } from '../services/endpoints/endpoints';
import {
  SearchUserAdapted,
  SearchUserResponse,
} from './responses/HTTPResponses';

const HASHMAP_ADAPTERS = {
  [HTTPPaths.searchUser]: function (
    res: SearchUserResponse
  ): SearchUserAdapted {
    const {
      response: {
        players: [
          { steamid, persona_name, profile_url, avatarfull, lastlogoff },
        ],
      },
    } = res;
    return {
      steamid: steamid ?? -1,
      persona_name: persona_name ?? '',
      profile_url: profile_url ?? '',
      avatarfull: avatarfull ?? '',
      lastlogoff: lastlogoff ?? -1,
    };
  },
} as const;

export function AdaptHTTPRequest(endpoint: string, val: Object) {
  const resultHash =
    HASHMAP_ADAPTERS[endpoint as keyof typeof HASHMAP_ADAPTERS];

  if (resultHash == null) return;
  return resultHash(val as Parameters<typeof resultHash>[0]);
}
