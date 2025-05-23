import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SearchUserAdapted } from '../../adapters/responses/HTTPResponses';

@Injectable({
  providedIn: 'root',
})
export class SteamContextService {
  constructor() {}

  public currentUser = new BehaviorSubject<SearchUserAdapted | null>(null);
}
