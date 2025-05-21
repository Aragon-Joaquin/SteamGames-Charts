import { Routes } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { LandingComponent } from '../pages/landing/landing.component';
import { NotFoundComponent } from '../pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'dashboard/:steamid', component: DashboardComponent },
  { path: '**', component: NotFoundComponent },
];
