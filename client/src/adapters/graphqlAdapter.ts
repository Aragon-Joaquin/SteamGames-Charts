import { getGraphqlEndpoints, GRAPHQL_ENDPOINTS } from '../services/endpoints';
import {
  AchievementPercentagesType,
  FriendListType,
  GameDetailsType,
  PlayerBansType,
  PlayerSummariesType,
  RecentGamesType,
  SchemaForGameType,
  UserOwnedGamesType,
} from '../services/endpoints/graphql';
import { UnixToDate } from '../utils';
import { SearchUserAdapted, USER_STATES } from './HTTPresponses';

const HASHMAP_ADAPTERS = {
  [GRAPHQL_ENDPOINTS.AchievementPercentages]: (
    res: AchievementPercentagesType
  ): AchievementPercentagesType => ({
    achievements: res?.achievements.map((el) => ({
      name: el?.name ?? '',
      percent: el?.percent ?? 0,
    })),
  }),
  [GRAPHQL_ENDPOINTS.FriendList]: (res: FriendListType): FriendListType => ({
    friends:
      res.friends?.map((el) => ({
        steamid: el.steamid,
        friends_since: el?.friends_since ?? -1,
        relationship: el?.relationship ?? '',
      })) ?? [],
  }),
  [GRAPHQL_ENDPOINTS.GameDetails]: ({
    data,
  }: GameDetailsType): GameDetailsType['data'] => ({
    steam_appid: data?.steam_appid ?? 0,
    name: data?.name ?? '',
    short_description: data?.short_description ?? '',
    genres: data.genres.map((e) => ({
      description: e.description ?? '',
      id: e.id ?? -1,
    })),
    developers: data?.developers ?? [],
    header_image: data?.header_image ?? '',
    price_overview: data?.price_overview ?? {
      currency: '',
      initial: 0,
      final: 0,
      discount_percent: 0,
      final_formatted: '',
    },
    publishers: data?.publishers ?? [],
    release_date: data?.release_date ?? { date: '' },
    required_age: data?.required_age ?? 0,
    supported_languages: data?.supported_languages ?? '',
  }),
  [GRAPHQL_ENDPOINTS.PlayerBans]: (res: PlayerBansType): PlayerBansType => ({
    players: res.players.map((player) => ({
      SteamId: player.SteamId,
      CommunityBanned: player.CommunityBanned ?? false,
      VACBanned: player.VACBanned ?? false,
      NumberOfVACBans: player.NumberOfVACBans ?? 0,
      DaysSinceLastBan: player.DaysSinceLastBan ?? 0,
      NumberOfGameBans: player.NumberOfGameBans ?? 0,
      EconomyBan: player.EconomyBan ?? 'none',
    })),
  }),
  [GRAPHQL_ENDPOINTS.PlayerSummaries]: (
    res: PlayerSummariesType
  ): { players: SearchUserAdapted[] } => ({
    players: res.players.map((player) => ({
      steamid: player.steamid ?? '',
      state:
        USER_STATES[player?.persona_state as keyof typeof USER_STATES] ??
        'Offline',
      persona_name: player.persona_name ?? '',
      profile_url: player.profile_url ?? '',
      avatarfull: player.avatarfull ?? '',
      lastlogoff:
        new UnixToDate(player.lastlogoff).getDifferenceTime() ?? '???',
    })),
  }),
  [GRAPHQL_ENDPOINTS.RecentGames]: (res: RecentGamesType): RecentGamesType => ({
    total_count: res.total_count ?? 0,
    games: res.games.map((game) => ({
      appid: game.appid,
      name: game.name ?? '',
      playtime_2weeks: game.playtime_2weeks ?? 0,
      playtime_forever: game.playtime_forever ?? 0,
      img_icon_url: game.img_icon_url ?? '',
      playtime_deck_forever: game.playtime_deck_forever ?? 0,
      playtime_linux_forever: game.playtime_linux_forever ?? 0,
      playtime_mac_forever: game.playtime_mac_forever ?? 0,
      playtime_windows_forever: game.playtime_windows_forever ?? 0,
    })),
  }),
  [GRAPHQL_ENDPOINTS.SchemaForGame]: (
    res: SchemaForGameType
  ): SchemaForGameType => ({
    gameName: res?.gameName ?? '',
    gameVersion: res?.gameVersion ?? '',
    availableGameStats: res?.availableGameStats ?? { achievements: [] },
    achievements: res.achievements ?? { achievements: [] },
  }),
  [GRAPHQL_ENDPOINTS.UserOwnedGames]: (
    res: UserOwnedGamesType
  ): UserOwnedGamesType => ({
    games_count: res.games_count ?? 0,
    games: res.games.map((game) => ({
      appid: game.appid,
      name: game.name ?? '',
      playtime_forever: game.playtime_forever ?? 0,
      img_icon_url: game.img_icon_url ?? '',
      playtime_platforms: game.playtime_platforms ?? {
        linux: 0,
        mac: 0,
        windows: 0,
      },
      rtime_last_played: game.rtime_last_played ?? 0,
    })),
  }),
} as const;

export type AdaptedGraphqlTypes<T extends getGraphqlEndpoints> = ReturnType<
  (typeof HASHMAP_ADAPTERS)[T]
>;

export function AdaptGRAPHQLRequest<T extends keyof typeof HASHMAP_ADAPTERS>(
  endpoint: T,
  val: Parameters<(typeof HASHMAP_ADAPTERS)[T]>[0]
) {
  const resultHash = HASHMAP_ADAPTERS[endpoint];

  if (resultHash == null) return;
  return (resultHash as (args: typeof val) => ReturnType<typeof resultHash>)(
    val
  );
}
