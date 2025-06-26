import { Component, inject, signal } from '@angular/core';
import { AdaptedGraphqlTypes } from '../../../../adapters/graphqlAdapter';
import { SteamContextService } from '../../../../services';
import { DashboardStateType } from '../../../../services/context/context.type';
import { GRAPHQL_ENDPOINTS } from '../../../../services/endpoints';
import { RoundDecimals } from '../../../../utils';
import {
  GamesNeverPlayedComponent,
  HeatMapComponent,
  InfoBoxesComponent,
  PieChartComponent,
  PieChartDataShape,
  TimeGraphComponent,
} from './components';

@Component({
  selector: 'dashboard-overview',
  imports: [
    InfoBoxesComponent,
    TimeGraphComponent,
    PieChartComponent,
    GamesNeverPlayedComponent,
    HeatMapComponent,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent {
  private Dashboard = inject(SteamContextService).DashboardState;
  public DashboardState = signal<DashboardStateType>({} as DashboardStateType);

  public PieChartData = signal<PieChartDataShape[]>([]);
  public TotalHoursPlayed = signal<number>(0);
  public HoursWeek = signal<number>(0);

  constructor() {
    this.Dashboard.subscribe((c) => {
      console.log(c);
      this.setPieChartData(c?.UserOwnedGames ?? null);

      const totalHours =
        c?.UserOwnedGames?.games.reduce(
          (acc, g) => acc + g?.playtime_forever,
          0
        ) ?? 0;
      this.TotalHoursPlayed.set(RoundDecimals(totalHours / 60));

      const hoursWeek =
        c?.RecentGames?.games.reduce(
          (acc, g) => acc + (g?.playtime_2weeks ?? 0),
          0
        ) ?? 0;

      this.HoursWeek.set(RoundDecimals(hoursWeek / 60));

      this.DashboardState.set(c);
    });
  }

  setPieChartData = (
    val: AdaptedGraphqlTypes<typeof GRAPHQL_ENDPOINTS.UserOwnedGames> | null
  ) => {
    if (!val) return;

    let result = {
      Windows: 0,
      Linux: 0,
      Mac: 0,
    };
    const keys = Object.keys(result);

    val.games?.forEach(
      ({
        playtime_windows_forever: w,
        playtime_linux_forever: l,
        playtime_mac_forever: m,
      }) => {
        [w, l, m].forEach((val, i) => {
          if (!val) return;
          result = {
            ...result,
            [keys[i]]: result[keys[i] as keyof typeof result] + val,
          };
        });
      }
    ) ?? [];

    this.PieChartData.set(
      Object.entries(result).map(([platform, hours]) => ({
        platform: platform as 'windows' | 'linux' | 'mac',
        hours,
      }))
    );
  };
}
