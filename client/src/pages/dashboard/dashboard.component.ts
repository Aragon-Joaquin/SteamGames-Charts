import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SteamContextService } from '../../services';
import {
  getGraphqlEndpoints,
  GRAPHQLCallsService,
} from '../../services/endpoints';
import { GQLQUERIES } from '../../services/endpoints/graphql/utils/ENDPOINTS_HASHMAP';
import { IsWindowUndefined, STEAM_ID_DIGITS } from '../../utils/constants';
import { OverviewComponent } from './components/overview/overview.component';

const DASHBOARD_STATES = {
  // views
  GENERAL: 'General',
  // extras
  NOT_FOUND: 'Not found',
  LOADING: 'Loading',
} as const;

type DASHBOARD_STATE_GRABBER =
  (typeof DASHBOARD_STATES)[keyof typeof DASHBOARD_STATES];

@Component({
  selector: 'app-dashboard',
  imports: [OverviewComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private GRAPHQLCalls = inject(GRAPHQLCallsService);

  public steamContext = inject(SteamContextService);
  public dashboardState = signal<DASHBOARD_STATE_GRABBER>(
    DASHBOARD_STATES.LOADING
  );

  setDashboardState = (val: DASHBOARD_STATE_GRABBER) =>
    this.dashboardState.set(val);

  // this is a mess
  ngOnInit() {
    if (IsWindowUndefined()) return;
    this.setDashboardState(DASHBOARD_STATES.LOADING);
    const getRoute = this.route.snapshot.paramMap.get('steamid')?.trim();

    if (getRoute == null || getRoute.length < STEAM_ID_DIGITS)
      return this.setDashboardState(DASHBOARD_STATES.NOT_FOUND);

    const UserSearched = this.steamContext.getUsersMap(getRoute);

    if (UserSearched != null) this.steamContext.setCurrentUser(UserSearched);
    else
      this.GRAPHQLCalls.QueryGraphQL([
        GQLQUERIES.getPlayerSummaries([getRoute]),
      ])?.subscribe((res) => {
        if (res == null)
          return this.setDashboardState(DASHBOARD_STATES.NOT_FOUND);
        this.steamContext.addUsersMap(
          res?.PlayerSummaries?.players?.map((p) => p ?? null) ?? null
        );
      });

    this.steamContext.usersMap.subscribe((userMap) => {
      const userExists = userMap.get(getRoute);
      if (userExists == null)
        return this.setDashboardState(DASHBOARD_STATES.NOT_FOUND);

      this.steamContext.setCurrentUser(userExists);
    });

    this.steamContext.currentUser.subscribe((user) => {
      if (!user) return this.setDashboardState(DASHBOARD_STATES.NOT_FOUND);
      const { steamid } = user;
      const res = this.GRAPHQLCalls.QueryGraphQL<getGraphqlEndpoints>([
        GQLQUERIES.getUserOwnedGames(steamid),
        GQLQUERIES.getFriendList(steamid),
        GQLQUERIES.getRecentGames(steamid),
        GQLQUERIES.getPlayerBans([steamid]),
      ]);

      if (res == null) return;
      res.subscribe((c) => c && this.steamContext.addDashboardState(c));
      this.setDashboardState(DASHBOARD_STATES.GENERAL);
    });
  }
}
