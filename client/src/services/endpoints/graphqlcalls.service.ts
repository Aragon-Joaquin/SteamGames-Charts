import { inject, Injectable } from '@angular/core';
import { ApolloError } from '@apollo/client/errors';
import { Apollo, gql } from 'apollo-angular';
import { catchError, of } from 'rxjs';
import { AdaptedGraphqlTypes } from '../../adapters/graphqlAdapter';
import { ErrorHandlingService } from '../errors/error-handling.service';
import { ErrorMessages, ErrorStatus } from '../errors/errorTypes';
import { getGraphqlEndpoints, GQL_INT64 } from './GRAPHQLendpoints';

import { IQueryGraphQL } from './graphql/utils/ENDPOINTS_HASHMAP';

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

    console.log(`query GraphQLEndpoint(${queries
      ?.map((el) => el?.Types ?? '')
      ?.join(',')}) {
          ${queries?.map((el) => el?.GQLQuery ?? '')?.join('\n')}
        }`);
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
