import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class ApicallsService {
  httpClient = inject(HttpClient);
  constructor() {}

  getData(endpoint: (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS]) {
    if (!endpoint || !API_ENDPOINTS[endpoint as keyof typeof API_ENDPOINTS]) {
      throw new Error('Bad Endpoint');
    }

    return this.httpClient.get(endpoint);
  }
}
