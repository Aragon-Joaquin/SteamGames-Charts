import { Injectable } from '@angular/core';
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
export class SteamContextService {
  constructor() {}

  private currentUser = new BehaviorSubject<
    Map<SearchUserAdapted['steamid'], SearchUserAdapted>
  >(new Map<SearchUserAdapted['steamid'], SearchUserAdapted>());

  //! user
  getCurrentUser(steamID: SearchUserAdapted['steamid']) {
    return this.currentUser.getValue().get(steamID) ?? null;
  }

  addCurrentUser(val: SearchUserAdapted | SearchUserAdapted[] | null) {
    if (!val) return;
    const CUserVal = this.currentUser.getValue();

    if (Array.isArray(val)) val.forEach((e) => CUserVal.set(e.steamid, e));
    else CUserVal.set(val.steamid, val);

    this.currentUser.next(CUserVal);
    this.setLocalStorage(
      CONTEXT_DATASTREAM_NAME.currentUser,
      CUserVal != null ? Object.fromEntries(CUserVal) : null
    );
  }

  overrideCurrentUser = () => {
    const val = this.getLocalStorage(CONTEXT_DATASTREAM_NAME.currentUser);
    try {
      if (typeof val !== 'object') return;

      const newMap = new Map();
      for (const SteamID in val) {
        if (Object.prototype.hasOwnProperty.call(val, SteamID))
          newMap.set(SteamID, val[SteamID]);
      }
      this.currentUser.next(newMap);
    } catch {
      this.currentUser.next(new Map());
    }
  };

  //! dashboard
  private DashboardState = new BehaviorSubject<DashboardStateType | null>(null);

  getDashboardState() {
    return this.DashboardState.getValue();
  }

  setDashboardState(val: Partial<DashboardStateType>) {
    this.DashboardState.next(val as DashboardStateType);
    this.setLocalStorage(
      CONTEXT_DATASTREAM_NAME.DashboardState,
      this.DashboardState.getValue() ?? null
    );
  }

  overrideDashboardState = () => {
    const val = this.getLocalStorage(CONTEXT_DATASTREAM_NAME.currentUser);
    this.DashboardState.next(val ?? {});
  };

  //! set/get states
  IsWindowUndefined = () =>
    typeof globalThis === 'undefined' || typeof window === 'undefined';

  setLocalStorage = (key: CONTEXT_KEYNAMES, val: any) => {
    if (this.IsWindowUndefined()) return;
    window.localStorage.setItem(key, JSON.stringify(val));
  };

  getLocalStorage = (key: CONTEXT_KEYNAMES) => {
    if (this.IsWindowUndefined()) return;
    const wLocal = window.localStorage.getItem(key);
    console.log(wLocal);
    return wLocal != null ? JSON.parse(wLocal) : null;
  };
}
