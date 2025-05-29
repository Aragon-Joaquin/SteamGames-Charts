import { HTTPPaths } from '../services/endpoints/endpoints';
import { UnixToDate } from '../utils';
import {
  SearchUserAdapted,
  SearchUserResponse,
  USER_STATES,
} from './responses';

const HASHMAP_ADAPTERS = {
  [HTTPPaths.searchUser]: function (
    res: SearchUserResponse
  ): SearchUserAdapted[] {
    const {
      response: { players },
    } = res;
    return players.map(
      ({
        steamid,
        personaname,
        personastate,
        profileurl,
        avatarfull,
        lastlogoff,
      }) => ({
        steamid: steamid ?? -1,
        state:
          USER_STATES[personastate as keyof typeof USER_STATES] ?? 'Unknown',
        persona_name: personaname ?? '',
        profile_url: profileurl ?? '',
        avatarfull: avatarfull ?? '',
        lastlogoff: new UnixToDate(
          lastlogoff ?? 0,
          USER_STATES[personastate as keyof typeof USER_STATES]
        ).getDifferenceTime(),
      })
    );
  },
} as const;

export function AdaptHTTPRequest(endpoint: string, val: Object) {
  const resultHash =
    HASHMAP_ADAPTERS[endpoint as keyof typeof HASHMAP_ADAPTERS];

  if (resultHash == null) return;
  return resultHash(val as Parameters<typeof resultHash>[0]);
}
