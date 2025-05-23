import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, map, of } from 'rxjs';
import { AdaptHTTPRequest } from '../../adapters/httpAdapters';
import { MakeEndpoint } from '../../utils/constants';
import { ErrorHandlingService } from '../errors/error-handling.service';
import { GRAPHQL_ENDPOINTS, HTTPPaths, POSTHTTPRoutes } from './endpoints';

@Injectable({
  providedIn: 'root',
})
export class ApicallsService {
  private httpClient = inject(HttpClient);
  private apolloService = inject(Apollo);
  private errorService = inject(ErrorHandlingService);

  GETGraphQLEndpoint(
    endpoint: (typeof GRAPHQL_ENDPOINTS)[keyof typeof GRAPHQL_ENDPOINTS]
  ) {
    if (
      !endpoint ||
      !GRAPHQL_ENDPOINTS[endpoint as keyof typeof GRAPHQL_ENDPOINTS]
    ) {
      throw new Error('Bad Endpoint');
    }
  }

  POSTHttpEndpoint<
    T extends (typeof POSTHTTPRoutes)[keyof typeof POSTHTTPRoutes]['createBody']
  >(
    endpoint: (typeof HTTPPaths)[keyof typeof HTTPPaths],
    body: T extends Function ? Parameters<T>[0] : null
  ) {
    const route = POSTHTTPRoutes[endpoint as keyof typeof POSTHTTPRoutes];
    if (route == null || body == null) return;

    return this.httpClient
      .post(MakeEndpoint(endpoint), JSON.stringify(body))
      .pipe(
        catchError((err, caught) => {
          console.log({ err });
          this.errorService.showError({
            httpError: 500,
            message: 'change this later',
            description: '',
          });
          return of(caught);
        }),
        map((value) => {
          if (value == null) return;
          return AdaptHTTPRequest(endpoint, value);
        })
      );
  }
}
