import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, map, Observable, of } from 'rxjs';
import { AdaptHTTPRequest, HASHMAP_GENERIC } from '../../adapters/httpAdapters';
import { MakeEndpoint } from '../../utils/constants';
import { ErrorHandlingService } from '../errors/error-handling.service';
import { FallbackError } from '../errors/errorTypes';
import {
  getGraphqlEndpoints,
  GETHTTPType,
  HTTPPaths,
  POSTHTTPRoutes,
  POSTHTTPType,
} from './index';

@Injectable({
  providedIn: 'root',
})
export class ApicallsService {
  private httpClient = inject(HttpClient);
  private apolloService = inject(Apollo);
  private errorService = inject(ErrorHandlingService);

  //! APOLLO SENDERS
  GraphQLEndpoint(endpoints: Array<getGraphqlEndpoints>) {
    const endSet = new Set(endpoints);

    this.apolloService
      .watchQuery({
        query: gql`
          {
            rates(currency: "USD") {
              currency
              rate
            }
          }
        `,
      })
      .valueChanges.subscribe((result: any) => {});
  }

  //! HTTP SENDERS
  POSTHttpEndpoint<
    T extends (typeof POSTHTTPRoutes)[keyof typeof POSTHTTPRoutes]['createBody'],
    Z extends POSTHTTPType
  >(
    endpoint: Z,
    body: T extends Function ? Parameters<T>[0] : null,
    fb?: FallbackError
  ) {
    const route = POSTHTTPRoutes[endpoint as keyof typeof POSTHTTPRoutes];
    if (route == null || body == null) return;

    return this.PipeResolver<Z>(
      this.httpClient.post(MakeEndpoint(endpoint), JSON.stringify(body)),
      endpoint,
      fb
    );
  }

  GETHttpEndpoint<T extends GETHTTPType>(endpoint: T, fb?: FallbackError) {
    if (endpoint == null) return;

    return this.PipeResolver<T>(
      this.httpClient.get(MakeEndpoint(endpoint)),
      endpoint,
      fb
    );
  }

  private PipeResolver<T extends (typeof HTTPPaths)[keyof typeof HTTPPaths]>(
    obs: Observable<Object>,
    endpoint: T,
    fb?: FallbackError
  ) {
    return obs.pipe(
      catchError((err, _) => {
        this.errorService.showError(
          {
            httpError: err?.status,
            message: err?.statusText,
            description: err?.error?.message,
          },
          fb
        );
        return of(null);
      }),
      map((value) => {
        if (value == null) return;

        return AdaptHTTPRequest(
          endpoint,
          value as Parameters<HASHMAP_GENERIC<T>>[0]
        );
      })
    );
  }
}
