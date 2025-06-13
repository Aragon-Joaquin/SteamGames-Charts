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
    if (typeof window === 'undefined') return;
    this.dashboardState.set(DASHBOARD_STATES.LOADING);
    const getRoute = this.route.snapshot.paramMap.get('steamid')?.trim();

    if (getRoute == null || getRoute.length < MIN_VANITYURL)
      return this.setDashboardState(DASHBOARD_STATES.NOT_FOUND);

    const UserSearched = this.steamContext.getCurrentUser(getRoute);

    if (UserSearched == null)
      return this.GRAPHQLCalls.QueryGraphQL([
        this.GRAPHQLCalls.getPlayerSummaries([getRoute]),
      ])?.subscribe((res) => {
        if (res == null)
          return this.setDashboardState(DASHBOARD_STATES.NOT_FOUND);
        this.steamContext.addCurrentUser(
          res?.data?.getPlayerSummaries['players']?.map((p) => p ?? null)
        );
        return this.dashboardState.set(DASHBOARD_STATES.GENERAL);
      });

    this.dashboardState.set(DASHBOARD_STATES.GENERAL);
  }
}
