import { Component } from '@angular/core';
import {
  InfoBoxesComponent,
  PieChartComponent,
  TimeGraphComponent,
} from './components';

@Component({
  selector: 'dashboard-overview',
  imports: [InfoBoxesComponent, TimeGraphComponent, PieChartComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent {}
