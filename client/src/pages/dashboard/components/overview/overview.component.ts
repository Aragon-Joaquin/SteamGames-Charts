import { Component } from '@angular/core';
import { InfoBoxesComponent } from './components/info-boxes/info-boxes.component';
import { TimeGraphComponent } from './components/time-graph/time-graph.component';

@Component({
  selector: 'dashboard-overview',
  imports: [InfoBoxesComponent, TimeGraphComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent {}
