import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SteamContextService } from '../../services';
import { GRAPHQLCallsService } from '../../services/endpoints';
import { MIN_VANITYURL } from '../../utils/constants';
import { OverviewComponent } from './components/overview/overview.component';

const DASHBOARD_STATES = {
  // views
  GENERAL: 'General',
  OWNED_GAMES: 'Owned Games',
  FRIENDS: 'Friends',
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
  private steamContext = inject(SteamContextService);
  private GRAPHQLCalls = inject(GRAPHQLCallsService);

  public dashboardState = signal<DASHBOARD_STATE_GRABBER>(
    DASHBOARD_STATES.LOADING
  );

  setDashboardState = (val: DASHBOARD_STATE_GRABBER) =>
    this.dashboardState.set(val);

  ngOnInit() {
    this.dashboardState.set(DASHBOARD_STATES.LOADING);
    const getRoute = this.route.snapshot.paramMap.get('steamid')?.trim();

    if (getRoute == null || getRoute.length < MIN_VANITYURL)
      return this.setDashboardState(DASHBOARD_STATES.NOT_FOUND);

    const UserSearched = this.steamContext.getCurrentUser(getRoute);

    //!there's a bug here: IEEE 754 Double-Precision Floating-Point Numbers
    //! the steamid is int64 and the standard only supports upto 2^53
    //TODO: i have no idea how to fix it, unless i pray that i can send it as a bigInt/String and works magically by the json.stringify
    if (UserSearched == null)
      return this.GRAPHQLCalls.getPlayerSummaries([Number(getRoute)]).subscribe(
        (res) => {
          if (res == null)
            return this.setDashboardState(DASHBOARD_STATES.NOT_FOUND);
          this.steamContext.addCurrentUser(
            res.data.getPlayerSummaries['players']?.map((p) => p ?? null)
          );
          return this.dashboardState.set(DASHBOARD_STATES.GENERAL);
        }
      );

    this.dashboardState.set(DASHBOARD_STATES.GENERAL);
  }
}
