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
    const val = this.getSessionStorage(CONTEXT_DATASTREAM_NAME.usersMap);
    try {
      if (typeof val !== 'object') return;

      const newMap = new Map();
      for (const SteamID in val) {
        if (Object.prototype.hasOwnProperty.call(val, SteamID))
          newMap.set(SteamID, val[SteamID]);
      }
      this.usersMap.next(newMap);
    } catch {
      this.usersMap.next(new Map());
    }
  }

  //! dashboard
  public DashboardState = new BehaviorSubject<DashboardStateType>(
    {} as DashboardStateType
  );

  getDashboardState() {
    return this.DashboardState.getValue();
  }

  addDashboardState(val: Partial<DashboardStateType>) {
    const currentVal = this.DashboardState.value;
    this.DashboardState.next({ ...currentVal, ...val });
    this.setSessionStorage(
      CONTEXT_DATASTREAM_NAME.DashboardState,
      this.DashboardState.getValue() ?? null
    );
  }

  overrideDashboardState() {
    const val = this.getSessionStorage(CONTEXT_DATASTREAM_NAME.usersMap);
    this.DashboardState.next(val ?? {});
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
}
