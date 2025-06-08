import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { ErrorHandlingService } from '../errors/error-handling.service';
import { getGraphqlEndpoints } from './GRAPHQLendpoints';

@Injectable({
  providedIn: 'root',
})
export class GRAPHQLCallsService {
  private errorService = inject(ErrorHandlingService);
  private apolloService = inject(Apollo);

  //! multiEndpoint maker
  GraphQLEndpoint(endpoints: Array<getGraphqlEndpoints>) {
    const allEndpoints = [...(new Set(endpoints) ?? [])].map((end) => {
      return end;
    });

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
      .valueChanges.subscribe((result) => {});
  }

  //! single endpoint makers
}
