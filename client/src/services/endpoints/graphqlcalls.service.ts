import { inject, Injectable } from '@angular/core';
import { ApolloError } from '@apollo/client/errors';
import { Apollo, gql } from 'apollo-angular';
import { catchError, of } from 'rxjs';
import { AdaptedGraphqlTypes } from '../../adapters/graphqlAdapter';
import { ErrorHandlingService } from '../errors/error-handling.service';
import { ErrorStatus } from '../errors/errorTypes';
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
import {
  AllGraphQLIDs,
  getGraphqlEndpoints,
  GRAPHQL_ENDPOINTS,
  GraphQLIDTypes,
} from './GRAPHQLendpoints';

interface IQueryGraphQL {
  GQLQuery: string;
  Variables: Partial<{ [key in AllGraphQLIDs]: GraphQLIDTypes<key> }>;
}
@Injectable({
  providedIn: 'root',
})
export class GRAPHQLCallsService {
  private errorService = inject(ErrorHandlingService);
  private apolloService = inject(Apollo);

  //* utils?
  private queryGraphQL<K extends getGraphqlEndpoints>({
    GQLQuery,
    Variables,
  }: IQueryGraphQL) {
    return this.apolloService
      .watchQuery<{ [P in K]: AdaptedGraphqlTypes<P> }>({
        query: gql`
          ${GQLQuery}
        `,
        variables: Variables,
        errorPolicy: 'all',
      })
      .valueChanges.pipe(
        catchError((err: ApolloError) => {
          this.errorService.showError({
            httpError: ErrorStatus.InternalServerError,
            message: err.name,
            description: err.message,
          });
          return of(null);
        })
      );
  }
  //! single endpoint makers
  getGameDetails(steam_appid: number) {
    return this.queryGraphQL<typeof GRAPHQL_ENDPOINTS.GameDetails>({
      GQLQuery: `query GetGameDetails($steam_appid: Int!) {
            getGameDetails(steam_appid: $steam_appid) {
              ${GameDetailsStringified}
            }
          }`,
      Variables: { steam_appid },
    });
  }

  getUserOwnedGames(steamid: number) {
    return this.queryGraphQL<typeof GRAPHQL_ENDPOINTS.UserOwnedGames>({
      GQLQuery: `query GetUserOwnedGames($steamid: Int!) {
            getUserOwnedGames(steamid: $steamid) {
              ${UserOwnedGamesStringified}
            }
          }`,
      Variables: { steamid },
    });
  }

  getPlayerSummaries(steamids: number[]) {
    return this.queryGraphQL<typeof GRAPHQL_ENDPOINTS.PlayerSummaries>({
      GQLQuery: `query GetPlayerSummaries($steamids: [Int!]!) {
            getPlayerSummaries(steamids: $steamids) {
              ${PlayerSummariesStringified}
            }
          }`,
      Variables: { steamids },
    });
  }

  getFriendList(steamid: number) {
    return this.queryGraphQL<typeof GRAPHQL_ENDPOINTS.FriendList>({
      GQLQuery: `query GetFriendList($steamid: Int!) {
            getFriendList(steamid: $steamid) {
              ${FriendListStringified}
            }
          }`,
      Variables: { steamid },
    });
  }

  getRecentGames(steamid: number) {
    return this.queryGraphQL<typeof GRAPHQL_ENDPOINTS.RecentGames>({
      GQLQuery: `query GetRecentGames($steamid: Int!) {
            getRecentGames(steamid: $steamid) {
              ${RecentGamesStringified}
            }
          }`,
      Variables: { steamid },
    });
  }

  getSchemaForGame(appid: number) {
    return this.queryGraphQL<typeof GRAPHQL_ENDPOINTS.SchemaForGame>({
      GQLQuery: `query GetSchemaForGame($appid: Int!) {
            getSchemaForGame(appid: $appid) {
              ${SchemaForGameStringified}
            }
          }`,
      Variables: { appid },
    });
  }

  getAchievementPercentages(gameid: number) {
    return this.queryGraphQL<typeof GRAPHQL_ENDPOINTS.AchievementPercentages>({
      GQLQuery: `query GetAchievementPercentages($gameid: Int!) {
            getAchievementPercentages(gameid: $gameid) {
              ${AchievementPercentagesStringify}
            }
          }`,
      Variables: { gameid },
    });
  }

  getPlayerBans(steamids: number[]) {
    return this.queryGraphQL<typeof GRAPHQL_ENDPOINTS.PlayerBans>({
      GQLQuery: `query GetPlayerBans($steamids: [Int!]!) {
            getPlayerBans(steamids: $steamids) {
              ${PlayerBansStringified}
            }
          }`,
      Variables: { steamids },
    });
  }
}
