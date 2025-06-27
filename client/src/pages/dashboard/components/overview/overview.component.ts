import { Component, inject, signal } from '@angular/core';
import { AdaptedGraphqlTypes } from '../../../../adapters/graphqlAdapter';
import { SteamContextService } from '../../../../services';
import { DashboardStateType } from '../../../../services/context/context.type';
import { GRAPHQL_ENDPOINTS } from '../../../../services/endpoints';
import { RoundDecimals } from '../../../../utils';
import {
  GamesNeverPlayedComponent,
  HeatMapComponent,
  heatMapDataType,
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
  private steamCTX = inject(SteamContextService);
  public DashboardState = signal<DashboardStateType>({} as DashboardStateType);

  public PieChartData = signal<PieChartDataShape[]>([]);
  public TotalHoursPlayed = signal<number>(0);
  public HoursWeek = signal<number>(0);
  public HeatMapData = signal<heatMapDataType[]>([]);

  constructor() {
    this.steamCTX.DashboardState.subscribe((data) => {
      const c =
        data.get(this.steamCTX.currentUser.value?.steamid ?? '') ?? null;
      if (!c) return;

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

      const heatmap =
        c.PlayerBans?.players.flatMap((g) => {
          return Object.entries(g).flatMap(([key, val]) => {
            if (key == 'SteamId') return [];
            const validateVal =
              (typeof val === 'string' && (val === 'none' ? 0 : 1)) ||
              (typeof val === 'boolean' && Number(val)) ||
              (typeof val == 'number' && val);
            return {
              Xgroup:
                this.steamCTX.getUsersMap(g.SteamId)?.persona_name ?? g.SteamId,
              Ygroup: key,
              value: validateVal == false ? 0 : validateVal,
              description:
                this.steamCTX.usersMap.value.get(g?.SteamId)?.persona_name ??
                '???',
            };
          });
        }) ?? [];

      this.HeatMapData.set(heatmap);

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
