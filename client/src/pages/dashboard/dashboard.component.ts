import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  steamID: string | null = '';

  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const getRoute = this.route.snapshot.paramMap.get('steamid');

    if (getRoute == null || !getRoute) return; //send 404 page or user not found
    this.steamID = getRoute;
  }
}
