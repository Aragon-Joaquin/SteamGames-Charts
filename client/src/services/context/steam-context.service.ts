import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SearchUserAdapted } from '../../adapters/HTTPresponses';
import {
  CONTEXT_DATASTREAM_NAME,
  CONTEXT_KEYNAMES,
  DashboardStateType,
} from './context.type';
@Injectable({
  providedIn: 'root',
})
export class SteamContextService implements OnInit {
  constructor() {}

  private currentUser = new BehaviorSubject<
    Map<SearchUserAdapted['steamid'], SearchUserAdapted>
  >(new Map<SearchUserAdapted['steamid'], SearchUserAdapted>());

  //! user
  getCurrentUser(steamID: SearchUserAdapted['steamid']) {
    console.log(this.currentUser.getValue());
    return this.currentUser.getValue().get(steamID);
  }

  addCurrentUser(val: SearchUserAdapted) {
    this.currentUser.next(
      this.getCurrentUser(val.steamid) != null
        ? this.currentUser.value.set(val.steamid, val)
        : new Map([[val.steamid, val]])
    );

    this.setLocalStorage(
      CONTEXT_DATASTREAM_NAME.currentUser,
      this.currentUser.getValue()
    );
  }

  //! dashboard
  private DashboardState = new BehaviorSubject<DashboardStateType | null>(null);

  getDashboardState() {
    return this.DashboardState.getValue();
  }

  setDashboardState(val: Partial<DashboardStateType>) {
    this.DashboardState.next(val as DashboardStateType);
    this.setLocalStorage(
      CONTEXT_DATASTREAM_NAME.DashboardState,
      this.DashboardState.getValue()
    );
  }

  //! set/get states

  setLocalStorage = (key: CONTEXT_KEYNAMES, val: any) => {
    if (window.localStorage == null) return;
    window?.localStorage?.setItem(key, JSON.parse(val));
  };

  getLocalStorage = (key: CONTEXT_KEYNAMES) => {
    const wLocal = window?.localStorage?.getItem(key);
    return wLocal != null ? JSON.parse(wLocal) : null;
  };

  ngOnInit(): void {
    const { DashboardState, currentUser } = CONTEXT_DATASTREAM_NAME;

    this.currentUser.next(this.getLocalStorage(currentUser));
    this.DashboardState.next(this.getLocalStorage(DashboardState));
  }
}
