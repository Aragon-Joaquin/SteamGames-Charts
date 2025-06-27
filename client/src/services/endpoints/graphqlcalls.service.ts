import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, map, of } from 'rxjs';
import { ErrorHandlingService } from '../errors/error-handling.service';
import { ErrorMessages, ErrorStatus } from '../errors/errorTypes';
import {
  EndpointToKey,
  getGraphqlEndpoints,
  GQL_INT64,
  GRAPHQL_ENDPOINTS,
  GraphQLResponsesMap,
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
      [P in T]: GraphQLResponsesMap[EndpointToKey<P>];
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
        const data = val?.data;
        if (val?.errors != null && val.errors?.length > 0)
          return this.errorService.showError({
            httpError:
              val.errors?.at(0) != null
                ? ErrorStatus.InternalServerError
                : ErrorStatus.BadRequest,
            message: ErrorMessages.UnknownError,
            description: val.errors?.at(0)?.message ?? 'No data returned',
          });

        const responseAdapted = Object.entries(GRAPHQL_ENDPOINTS)
          .filter(([_, k]) => data[k as keyof typeof data])
          .map(([val, key]) => {
            const result = data[key as keyof typeof data];
            return result && { [val]: AdaptGRAPHQLRequest(key, result) };
          });

        return Object.assign({}, ...responseAdapted) as Partial<{
          [K in T as EndpointToKey<K>]: AdaptedGraphqlTypes<K>;
        }>;
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
