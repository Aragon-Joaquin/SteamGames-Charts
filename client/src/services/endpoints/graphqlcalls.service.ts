import { inject, Injectable } from '@angular/core';
import { onError } from '@apollo/client/link/error';
import { Apollo, gql } from 'apollo-angular';
import { AdaptedGraphqlTypes } from '../../adapters/graphqlAdapter';
import { ErrorHandlingService } from '../errors/error-handling.service';
import { AllGraphQLEndpoints, GRAPHQL_ENDPOINTS } from './GRAPHQLendpoints';
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
    const allEndpoints = endpoints.map(({ end }, idx) => {
      const hashmapFunc = this.HASHMAP_GRAPHQLFIELDS[end];

      if (hashmapFunc == undefined) return;
      return hashmapFunc(idx);
    });

    // naming variables/types is my passion
    type GraphqlResponseOfAdaptedType = {
      [K in (typeof endpoints)[number]['end']]: AdaptedGraphqlTypes<K>;
    };

    return this.apolloService
      .watchQuery<GraphqlResponseOfAdaptedType>({
        query: gql`
          ${allEndpoints.join('\n')}
        `,
        variables: Object.assign(
          {},
          ...endpoints.map(({ id }, idx) => ({
            [`id${idx + 1}`]: id,
          }))
        ),
        errorPolicy: 'all',
      })
      .valueChanges.pipe((el) => {
        onError(({ graphQLErrors, networkError }) => {
          if (graphQLErrors)
            graphQLErrors.map(({ message, locations, path }) =>
              console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
              )
            );

          if (networkError) console.log(`[Network error]: ${networkError}`);
        });
        return el;
      });
  }
}
