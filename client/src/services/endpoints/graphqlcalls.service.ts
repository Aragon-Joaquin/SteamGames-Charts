import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, map, of } from 'rxjs';
import { ErrorHandlingService } from '../errors/error-handling.service';
import { ErrorMessages, ErrorStatus } from '../errors/errorTypes';
import {
  getGraphqlEndpoints,
  GQL_INT64,
  GRAPHQL_ENDPOINTS,
  ResponseDataType,
} from './GRAPHQLendpoints';
import { IQueryGraphQL } from './graphql/utils/ENDPOINTS_HASHMAP';

import { ApolloError } from '@apollo/client/errors';
import {
  AdaptedGraphqlTypes,
  AdaptGRAPHQLRequest,
} from '../../adapters/graphqlAdapter';
@Injectable({
  providedIn: 'root',
})
export class GRAPHQLCallsService {
  private errorService = inject(ErrorHandlingService);
  private apolloService = inject(Apollo);

  /**
   * @description GQLQUERIES hashmap by importing it from graphql/utils
   * @example SINGLE: QueryGraphQL(GQLQUERIES.getPlayerSummaries([300]))
   * @example MULTIPLE:
   * QueryGraphQL<getGraphqlEndpoints>([ GQLQUERIES.getUserOwnedGames(730), GQLQUERIES.getFriendList(730)])
   */
  public QueryGraphQL<T extends getGraphqlEndpoints>(
    queries: (T extends getGraphqlEndpoints ? IQueryGraphQL<T> : never)[]
  ) {
    const Variables: IQueryGraphQL<T>['Variables'] = Object.assign(
      {},
      ...queries?.map((el) => el?.Variables ?? {})
    );
    if (!this.TestForGQL_INT64<T>(Variables))
      return this.errorService.showError({
        httpError: ErrorStatus.BadRequest,
        message: ErrorMessages.NotGQL_INT64,
      });

    const apolloQuery = this.apolloService.watchQuery<{
      [P in T]: AdaptedGraphqlTypes<P>;
    }>({
      query: gql`
        query GraphQLEndpoint(${queries
          ?.map((el) => el?.Types ?? '')
          ?.join(',')}) {
          ${queries?.map((el) => el?.GQLQuery ?? '')?.join('\n')}
        }
      `,
      variables: Variables,
      errorPolicy: 'all',
    });

    return apolloQuery.valueChanges.pipe(
      map((val) => {
        const data = val?.data as Partial<ResponseDataType>;
        if (!data) return;

        const responseAdapted = Object.values(GRAPHQL_ENDPOINTS)
          .filter((k) => data[k])
          .map((key) => {
            const result = data[key as keyof typeof data];
            return result && { [key]: AdaptGRAPHQLRequest(key, result) };
          });

        return Object.assign(
          {} as { [K in T]: AdaptedGraphqlTypes<K> },
          ...responseAdapted
        );
      }),
      catchError((err: ApolloError) => {
        this.errorService.showError({
          httpError: ErrorStatus.InternalServerError,
          message: err.name,
          description: err.message,
        });
        return of(null);
      })
    );

    //! goal: {getUserOwnedGames: {…}, getFriendList: {…}, getRecentGames: {…}, getPlayerBans: {…}}
    // return of(mockJSON['data'] as unknown as ResponseDataType).pipe(
    //   map((val) => {
    //     const test = Object.values(GRAPHQL_ENDPOINTS)
    //       .filter((k) => val[k])
    //       .map((key) => {
    //         const result = val[key as keyof typeof val];
    //         return result && { [key]: AdaptGRAPHQLRequest(key, result) };
    //       });

    //     return Object.assign(
    //       {} as { [K in T]: AdaptedGraphqlTypes<K> },
    //       ...test
    //     );
    //   })
    // );
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
}
