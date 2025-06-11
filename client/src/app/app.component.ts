import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorHandlingService, SteamContextService } from '../services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: `./app.styles.css`,
})
export class AppComponent {
  public errorService = inject(ErrorHandlingService);
  private steamCtx = inject(SteamContextService);

  //! load contexts
  ngOnInit(): void {
    this.steamCtx.overrideCurrentUser();
    this.steamCtx.overrideDashboardState();
  }
}
