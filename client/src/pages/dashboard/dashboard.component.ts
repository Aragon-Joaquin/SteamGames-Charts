import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchUserAdapted } from '../../adapters/responses/HTTPResponses';
import {
  ApicallsService,
  HTTPPaths,
  SteamContextService,
} from '../../services';
import { MIN_VANITYURL } from '../../utils/constants';
import { OverviewComponent } from './components/overview/overview.component';

const DASHBOARD_STATES = {
  // views
  GENERAL: 'general',
  OWNED_GAMES: 'owned_games',
  FRIENDS: 'friends',
  // extras
  NOT_FOUND: 'not_found',
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
  private apiCalls = inject(ApicallsService);

  public dashboardState = signal<DASHBOARD_STATE_GRABBER>(
    DASHBOARD_STATES.GENERAL
  );

  setDashboardState = (val: DASHBOARD_STATE_GRABBER) =>
    this.dashboardState.set(val);

  ngOnInit(): void {
    const getRoute = this.route.snapshot.paramMap.get('steamid')?.trim();
    if (getRoute == null || getRoute.length < MIN_VANITYURL)
      return this.setDashboardState(DASHBOARD_STATES.NOT_FOUND);
    const UserSearched = this.steamContext.currentUser.getValue();
    if (UserSearched == null)
      this.apiCalls
        .POSTHttpEndpoint(HTTPPaths.searchUser, {
          VanityUrl: getRoute,
        })
        ?.subscribe((res) =>
          this.steamContext.currentUser.next(res as SearchUserAdapted)
        );
  }
}
