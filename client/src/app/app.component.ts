import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorHandlingService } from '../services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  public errorService = inject(ErrorHandlingService);
}
