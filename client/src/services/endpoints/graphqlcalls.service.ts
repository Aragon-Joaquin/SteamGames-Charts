import { inject, Injectable } from '@angular/core';
import { ApolloError } from '@apollo/client/errors';
import { Apollo, gql } from 'apollo-angular';
import { catchError, of } from 'rxjs';
import { AdaptedGraphqlTypes } from '../../adapters/graphqlAdapter';
import { ErrorHandlingService } from '../errors/error-handling.service';
import { ErrorMessages, ErrorStatus } from '../errors/errorTypes';
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
  getGraphqlEndpoints,
  GQL_INT64,
  GRAPHQL_ENDPOINTS,
  GRAPHQL_VARIABLES_NAME,
  GraphQLIDTypes,
} from './GRAPHQLendpoints';

// todo: fix these types
interface IQueryGraphQL<T extends getGraphqlEndpoints> {
  GQLQuery: string;
  Variables: {
    [key in T]: GraphQLIDTypes<(typeof GRAPHQL_VARIABLES_NAME)[key]>;
  };
}
@Injectable({
  providedIn: 'root',
})
export class GRAPHQLCallsService {
  private errorService = inject(ErrorHandlingService);
  private apolloService = inject(Apollo);

  //* utils?
  private queryGraphQL<T extends getGraphqlEndpoints>({
    GQLQuery,
    Variables,
  }: IQueryGraphQL<T>) {
    if (!this.TestForGQL_INT64<T>(Variables))
      return this.errorService.showError({
        httpError: ErrorStatus.BadRequest,
        message: ErrorMessages.NotGQL_INT64,
      });

    return this.apolloService
      .watchQuery<{ [P in T]: AdaptedGraphqlTypes<P> }>({
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

  private TestForGQL_INT64<T extends getGraphqlEndpoints>(
    allVars: IQueryGraphQL<T>['Variables']
  ) {
    return Object.entries(allVars).every(([_, val]) => {
      if (Array.isArray(val))
        return val.every((e) => this.Validate_GQLINT64(e as GQL_INT64));
      return this.Validate_GQLINT64(val as GQL_INT64);
    });
  }

  private Validate_GQLINT64 = (val: GQL_INT64) =>
    typeof val == 'string' && val?.length > 0
      ? new RegExp(/^\d+$/).test(val)
      : false;

  //! single endpoint makers
  getGameDetails(steam_appid: GQL_INT64) {
    return this.queryGraphQL<typeof GRAPHQL_ENDPOINTS.GameDetails>({
      GQLQuery: `query GetGameDetails($${GRAPHQL_ENDPOINTS.GameDetails}: ID!) {
            getGameDetails(steam_appid: $${GRAPHQL_ENDPOINTS.GameDetails}) {
              ${GameDetailsStringified}
            }
          }`,
      Variables: { getGameDetails: steam_appid },
    });
  }

  getUserOwnedGames(steamid: GQL_INT64) {
    return this.queryGraphQL<typeof GRAPHQL_ENDPOINTS.UserOwnedGames>({
      GQLQuery: `query GetUserOwnedGames($${GRAPHQL_ENDPOINTS.UserOwnedGames}: ID!) {
            getUserOwnedGames(steamid: $${GRAPHQL_ENDPOINTS.UserOwnedGames}) {
              ${UserOwnedGamesStringified}
            }
          }`,
      Variables: { getUserOwnedGames: steamid },
    });
  }

  getPlayerSummaries(steamids: GQL_INT64[]) {
    return this.queryGraphQL<typeof GRAPHQL_ENDPOINTS.PlayerSummaries>({
      GQLQuery: `query GetPlayerSummaries($${GRAPHQL_ENDPOINTS.PlayerSummaries}: [ID!]!) {
            getPlayerSummaries(steamids: $${GRAPHQL_ENDPOINTS.PlayerSummaries}) {
              ${PlayerSummariesStringified}
            }
          }`,
      Variables: { getPlayerSummaries: steamids },
    });
  }

  getFriendList(steamid: GQL_INT64) {
    return this.queryGraphQL<typeof GRAPHQL_ENDPOINTS.FriendList>({
      GQLQuery: `query GetFriendList($${GRAPHQL_ENDPOINTS.FriendList}: ID!) {
            getFriendList(steamid: $${GRAPHQL_ENDPOINTS.FriendList}) {
              ${FriendListStringified}
            }
          }`,
      Variables: { getFriendList: steamid },
    });
  }

  getRecentGames(steamid: GQL_INT64) {
    return this.queryGraphQL<typeof GRAPHQL_ENDPOINTS.RecentGames>({
      GQLQuery: `query GetRecentGames($${GRAPHQL_ENDPOINTS.RecentGames}: ID!) {
            getRecentGames(steamid: $${GRAPHQL_ENDPOINTS.RecentGames}) {
              ${RecentGamesStringified}
            }
          }`,
      Variables: { getRecentGames: steamid },
    });
  }

  getSchemaForGame(appid: GQL_INT64) {
    return this.queryGraphQL<typeof GRAPHQL_ENDPOINTS.SchemaForGame>({
      GQLQuery: `query GetSchemaForGame($${GRAPHQL_ENDPOINTS.SchemaForGame}: ID!) {
            getSchemaForGame(appid: $${GRAPHQL_ENDPOINTS.SchemaForGame}) {
              ${SchemaForGameStringified}
            }
          }`,
      Variables: { getSchemaForGame: appid },
    });
  }

  getAchievementPercentages(gameid: GQL_INT64) {
    return this.queryGraphQL<typeof GRAPHQL_ENDPOINTS.AchievementPercentages>({
      GQLQuery: `query GetAchievementPercentages($${GRAPHQL_ENDPOINTS.AchievementPercentages}: ID!) {
            getAchievementPercentages(gameid: $${GRAPHQL_ENDPOINTS.AchievementPercentages}) {
              ${AchievementPercentagesStringify}
            }
          }`,
      Variables: { getAchievementPercentages: gameid },
    });
  }

  getPlayerBans(steamids: GQL_INT64[]) {
    return this.queryGraphQL<typeof GRAPHQL_ENDPOINTS.PlayerBans>({
      GQLQuery: `query GetPlayerBans($${GRAPHQL_ENDPOINTS.PlayerBans}: [ID!]!) {
            getPlayerBans(steamids: $${GRAPHQL_ENDPOINTS.PlayerBans}) {
              ${PlayerBansStringified}
            }
          }`,
      Variables: { getPlayerBans: steamids },
    });
  }
}
