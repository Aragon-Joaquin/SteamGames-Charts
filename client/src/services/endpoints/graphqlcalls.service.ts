import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { ErrorHandlingService } from '../errors/error-handling.service';
import {
  AllGraphQLEndpoints,
  GRAPHQL_ENDPOINTS,
  GraphQLResponses,
} from './GRAPHQLendpoints';
import {
  AchievementPercentagesStringify,
  FriendListStringified,
  GameDetailsStringified,
  PlayerBansStringified,
  PlayerSummariesStringified,
  RecentGamesStringified,
  SchemaForGameStringified,
  UserOwnedGamesStringified,
} from './graphql/index';

@Injectable({
  providedIn: 'root',
})
export class GRAPHQLCallsService {
  private errorService = inject(ErrorHandlingService);
  private apolloService = inject(Apollo);

  //! single endpoint makers
  private HASHMAP_GRAPHQLFIELDS: Record<
    (typeof GRAPHQL_ENDPOINTS)[AllGraphQLEndpoints],
    (idNum: number) => string
  > = {
    getGameDetails: (
      idNum: number
    ) => `getGameDetails(steam_appid: $id${idNum}) {
        ${GameDetailsStringified}
      }`,

    getUserOwnedGames: (
      idNum: number
    ) => `getUserOwnedGames(steam_id: $id${idNum}) {
      ${UserOwnedGamesStringified}
    }`,
    getPlayerSummaries: (
      idNum: number
    ) => `getPlayerSummaries(steamids: $id${idNum}) {
      ${PlayerSummariesStringified}
    }`,
    getFriendList: (idNum: number) => `getFriendList(steam_id: $id${idNum}) {
      ${FriendListStringified}
    }`,
    getRecentGames: (idNum: number) => `getRecentGames(steam_id: $id${idNum}) {
      ${RecentGamesStringified}
    }`,
    getSchemaForGame: (idNum: number) => `getSchemaForGame(appid: $id${idNum}) {
      ${SchemaForGameStringified}
    }`,
    getAchievementPercentages: (
      idNum: number
    ) => `getAchievementPercentages(game_id: $id${idNum}) {
      ${AchievementPercentagesStringify}
    }`,
    getPlayerBans: (idNum: number) => `getPlayerBans(steamids: $id${idNum}) {
      ${PlayerBansStringified}
    }`,
  };

  //! multiEndpoint maker - temporal solution
  GraphQLEndpoint<T extends (typeof GRAPHQL_ENDPOINTS)[AllGraphQLEndpoints]>(
    endpoints: Array<{
      end: T;
      id: T extends 'getPlayerBans' | 'getPlayerSummaries' ? number[] : number;
    }>
  ) {
    const allEndpoints = [...(new Set(endpoints) ?? [])].map(({ end }, idx) => {
      const hashmapFunc = this.HASHMAP_GRAPHQLFIELDS[end];

      if (hashmapFunc == undefined) return;
      return hashmapFunc(idx);
    });

    const finalQuery = allEndpoints.join('\n');
    this.apolloService
      .watchQuery<GraphQLResponses>({
        query: gql`
          ${finalQuery}
        `,
        variables: Object.assign(
          {},
          ...endpoints.map(({ id }, idx) => ({
            [`id${idx + 1}`]: id,
          }))
        ),
      })
      .valueChanges.subscribe((result) => {
        console.log(result.data);
      });
  }
}
