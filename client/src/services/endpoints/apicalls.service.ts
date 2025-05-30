import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, map, Observable, of } from 'rxjs';
import {
  ADAPTERS_PARAMETERS,
  AdaptHTTPRequest,
} from '../../adapters/httpAdapters';
import { MakeEndpoint } from '../../utils/constants';
import { ErrorHandlingService } from '../errors/error-handling.service';
import {
  GETHTTPType,
  GRAPHQL_ENDPOINTS,
  HTTPPaths,
  POSTHTTPRoutes,
  POSTHTTPType,
} from './endpoints';

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
    endpoint: POSTHTTPType,
    body: T extends Function ? Parameters<T>[0] : null
  ) {
    const route = POSTHTTPRoutes[endpoint as keyof typeof POSTHTTPRoutes];
    if (route == null || body == null) return;

    return this.PipeResolver(
      this.httpClient.post(MakeEndpoint(endpoint), JSON.stringify(body)),
      endpoint
    );
  }

  GETHttpEndpoint(endpoint: GETHTTPType) {
    if (endpoint == null) return;

    return this.PipeResolver(
      this.httpClient.get(MakeEndpoint(endpoint)),
      endpoint
    );
  }

  private PipeResolver(
    obs: Observable<Object>,
    endpoint: (typeof HTTPPaths)[keyof typeof HTTPPaths]
  ) {
    return obs.pipe(
      catchError((err, _caught) => {
        this.errorService.showError({
          httpError: err?.status,
          message: err?.name,
          description: err?.statusText,
        });
        return of(null);
      }),
      map((value) => {
        if (value == null) return;

        return AdaptHTTPRequest(endpoint, value as ADAPTERS_PARAMETERS);
      })
    );
  }
}
