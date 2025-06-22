import { Component, inject, signal } from '@angular/core';
import { AdaptedGraphqlTypes } from '../../../../adapters/graphqlAdapter';
import { SteamContextService } from '../../../../services';
import { DashboardStateType } from '../../../../services/context/context.type';
import { GRAPHQL_ENDPOINTS } from '../../../../services/endpoints';
import {
  InfoBoxesComponent,
  PieChartComponent,
  PieChartDataShape,
  TimeGraphComponent,
} from './components';

@Component({
  selector: 'dashboard-overview',
  imports: [InfoBoxesComponent, TimeGraphComponent, PieChartComponent],
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
      this.setPieChartData(c?.UserOwnedGames ?? null);

      this.TotalHoursPlayed.set(
        c?.UserOwnedGames?.games.reduce(
          (acc, g) => acc + g?.playtime_forever,
          0
        ) ?? 0
      );

      this.HoursWeek.set(
        c?.RecentGames?.games.reduce(
          (acc, g) => acc + (g?.playtime_2weeks ?? 0),
          0
        ) ?? 0
      );

      this.DashboardState.set(c);
    });
  }

  setPieChartData = (
    val: AdaptedGraphqlTypes<typeof GRAPHQL_ENDPOINTS.UserOwnedGames> | null
  ) => {
    if (!val) return;
    const data: PieChartDataShape[] =
      val.games?.flatMap(({ playtime_platforms }) => {
        const { windows, linux, mac } = playtime_platforms;
        return [
          { platform: 'windows', hours: windows },
          { platform: 'linux', hours: linux },
          { platform: 'mac', hours: mac },
        ];
      }) ?? [];
    this.PieChartData.set(data);
  };
}
