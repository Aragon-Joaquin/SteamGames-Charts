import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorHandlerComponent } from './components/error-handler/error-handler.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
  imports: [ReactiveFormsModule, ErrorHandlerComponent],
})
export class LandingComponent {
  userName = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(20),
    Validators.pattern(/^\d+/),
  ]);

  onSubmit() {
    this.userName.reset();
  }
}
