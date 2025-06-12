import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { AdaptedGraphqlTypes } from '../../adapters/graphqlAdapter';
import { ErrorHandlingService } from '../errors/error-handling.service';
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
  getGameDetails(steamAppId: number) {
    return this.apolloService.watchQuery<{
      getGameDetails: AdaptedGraphqlTypes<'getGameDetails'>;
    }>({
      query: gql`
          query GetGameDetails($steamAppId: Float!) {
            getGameDetails(steam_appid: $steamAppId) {
              ${GameDetailsStringified}
            }
          }
        `,
      variables: { steamAppId },
      errorPolicy: 'all',
    }).valueChanges;
  }

  getUserOwnedGames(steamId: number) {
    return this.apolloService.watchQuery<{
      getUserOwnedGames: AdaptedGraphqlTypes<'getUserOwnedGames'>;
    }>({
      query: gql`
          query GetUserOwnedGames($steamId: Float!) {
            getUserOwnedGames(steam_id: $steamId) {
              ${UserOwnedGamesStringified}
            }
          }
        `,
      variables: { steamId },
      errorPolicy: 'all',
    }).valueChanges;
  }

  getPlayerSummaries(steamIds: number[]) {
    return this.apolloService.watchQuery<{
      getPlayerSummaries: AdaptedGraphqlTypes<'getPlayerSummaries'>;
    }>({
      query: gql`
          query GetPlayerSummaries($steamIds: [Float!]!) {
            getPlayerSummaries(steamids: $steamIds) {
              ${PlayerSummariesStringified}
            }
          }
        `,
      variables: { steamIds },
      errorPolicy: 'all',
    }).valueChanges;
  }

  getFriendList(steamId: number) {
    return this.apolloService.watchQuery<{
      getFriendList: AdaptedGraphqlTypes<'getFriendList'>;
    }>({
      query: gql`
          query GetFriendList($steamId: Float!) {
            getFriendList(steam_id: $steamId) {
              ${FriendListStringified}
            }
          }
        `,
      variables: { steamId },
      errorPolicy: 'all',
    }).valueChanges;
  }

  getRecentGames(steamId: number) {
    return this.apolloService.watchQuery<{
      getRecentGames: AdaptedGraphqlTypes<'getRecentGames'>;
    }>({
      query: gql`
          query GetRecentGames($steamId: Float!) {
            getRecentGames(steam_id: $steamId) {
              ${RecentGamesStringified}
            }
          }
        `,
      variables: { steamId },
      errorPolicy: 'all',
    }).valueChanges;
  }

  getSchemaForGame(appId: number) {
    return this.apolloService.watchQuery<{
      getSchemaForGame: AdaptedGraphqlTypes<'getSchemaForGame'>;
    }>({
      query: gql`
          query GetSchemaForGame($appId: Float!) {
            getSchemaForGame(appid: $appId) {
              ${SchemaForGameStringified}
            }
          }
        `,
      variables: { appId },
      errorPolicy: 'all',
    }).valueChanges;
  }

  getAchievementPercentages(gameId: number) {
    return this.apolloService.watchQuery<{
      getAchievementPercentages: AdaptedGraphqlTypes<'getAchievementPercentages'>;
    }>({
      query: gql`
          query GetAchievementPercentages($gameId: Float!) {
            getAchievementPercentages(gameId: $gameId) {
              ${AchievementPercentagesStringify}
            }
          }
        `,
      variables: { gameId },
      errorPolicy: 'all',
    }).valueChanges;
  }

  getPlayerBans(steamIds: number[]) {
    return this.apolloService.watchQuery<{
      getPlayerBans: AdaptedGraphqlTypes<'getPlayerBans'>;
    }>({
      query: gql`
          query GetPlayerBans($steamIds: [Float!]!) {
            getPlayerBans(steamids: $steamIds) {
              ${PlayerBansStringified}
            }
          }
        `,
      variables: { steamIds },
      errorPolicy: 'all',
    }).valueChanges;
  }
}
