import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SearchUserAdapted } from '../../adapters/HTTPresponses';
import { IsWindowUndefined } from '../../utils';
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

  public usersMap = new BehaviorSubject<
    Map<SearchUserAdapted['steamid'], SearchUserAdapted>
  >(new Map<SearchUserAdapted['steamid'], SearchUserAdapted>());

  public currentUser = new BehaviorSubject<SearchUserAdapted | null>(null);

  //! user
  getUsersMap = (steamID: SearchUserAdapted['steamid']) =>
    this.usersMap.getValue().get(steamID) ?? null;

  addUsersMap(val: SearchUserAdapted | SearchUserAdapted[] | null) {
    if (!val) return;
    const CUserVal = this.usersMap.getValue();

    if (Array.isArray(val)) val.forEach((e) => CUserVal.set(e.steamid, e));
    else CUserVal.set(val.steamid, val);

    this.usersMap.next(CUserVal);
    this.setSessionStorage(
      CONTEXT_DATASTREAM_NAME.usersMap,
      CUserVal != null ? Object.fromEntries(CUserVal) : null
    );
  }

  setCurrentUser = (val: SearchUserAdapted) => this.currentUser.next(val);

  overrideUsersMap() {
    const res = this.JSONToMap(
      this.getSessionStorage(CONTEXT_DATASTREAM_NAME.usersMap)
    );
    this.usersMap.next(res);
  }

  //! dashboard
  public DashboardState = new BehaviorSubject<
    Map<SearchUserAdapted['steamid'], DashboardStateType>
  >(new Map());

  getDashboardState(steamid: SearchUserAdapted['steamid'] | null) {
    return this.DashboardState.getValue().get(steamid ?? '') ?? null;
  }

  addDashboardState(
    cUser: SearchUserAdapted['steamid'] | undefined,
    val: Partial<DashboardStateType>
  ) {
    if (!cUser) return;
    const currentVal = this.DashboardState.value;
    this.DashboardState.next(currentVal.set(cUser, val as DashboardStateType));

    this.setSessionStorage(
      CONTEXT_DATASTREAM_NAME.DashboardState,
      currentVal != null ? Object.fromEntries(currentVal) : null
    );
  }

  overrideDashboardState() {
    const res = this.JSONToMap(
      this.getSessionStorage(CONTEXT_DATASTREAM_NAME.DashboardState)
    );
    this.DashboardState.next(res);
  }

  //! set/get states
  setSessionStorage = (key: CONTEXT_KEYNAMES, val: any) => {
    if (IsWindowUndefined()) return;
    window.sessionStorage.setItem(key, JSON.stringify(val));
  };

  getSessionStorage = (key: CONTEXT_KEYNAMES) => {
    if (IsWindowUndefined()) return;
    const wLocal = window.sessionStorage.getItem(key);
    return wLocal != null ? JSON.parse(wLocal) : null;
  };

  private JSONToMap(val: any) {
    const newMap = new Map();
    try {
      if (typeof val !== 'object') return newMap;

      for (const key in val) {
        if (Object.prototype.hasOwnProperty.call(val, key))
          newMap.set(key, val[key]);
      }

      return newMap;
    } catch {
      return new Map();
    }
  }
}
