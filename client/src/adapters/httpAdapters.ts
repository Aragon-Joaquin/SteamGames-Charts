import { HTTPPaths } from '../services/endpoints/HTTPendpoints';
import { UnixToDate } from '../utils';
import {
  SearchUserAdapted,
  SearchUserResponse,
  totalUsersAdapted,
  totalUsersResponse,
  USER_STATES,
} from './responses';

const UNDEFINED_NUMBER = -1 as const;

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
        steamid: steamid ?? UNDEFINED_NUMBER,
        state:
          USER_STATES[personastate as keyof typeof USER_STATES] ?? 'Unknown',
        persona_name: personaname ?? '',
        profile_url: profileurl ?? '',
        avatarfull: avatarfull ?? '',
        lastlogoff: new UnixToDate(
          lastlogoff,
          USER_STATES[personastate as keyof typeof USER_STATES]
        ).getDifferenceTime(),
      })
    );
  },
  [HTTPPaths.totalUsers]: function (
    res: totalUsersResponse
  ): totalUsersAdapted {
    const {
      response: { last_update, Ranks },
    } = res;
    return {
      last_update: new UnixToDate(last_update).parseMinutes() ?? '???',
      Ranks: Ranks.map(({ rank, appid, concurrent_in_game, peak_in_game }) => ({
        rank: rank ?? UNDEFINED_NUMBER,
        appid: appid ?? UNDEFINED_NUMBER,
        concurrent_in_game: concurrent_in_game ?? UNDEFINED_NUMBER,
        peak_in_game: peak_in_game ?? UNDEFINED_NUMBER,
      })),
    };
  },
} as const;

export type ADAPTERS_PARAMETERS = Parameters<
  (typeof HASHMAP_ADAPTERS)[keyof typeof HASHMAP_ADAPTERS]
>[0];

export type HASHMAP_GENERIC<
  T extends (typeof HTTPPaths)[keyof typeof HTTPPaths]
> = (typeof HASHMAP_ADAPTERS)[T];

export function AdaptHTTPRequest<T extends keyof typeof HASHMAP_ADAPTERS>(
  endpoint: T,
  val: Parameters<(typeof HASHMAP_ADAPTERS)[T]>[0]
) {
  const resultHash = HASHMAP_ADAPTERS[endpoint];

  if (resultHash == null) return;
  return (resultHash as (args: typeof val) => ReturnType<typeof resultHash>)(
    val
  );
}
