import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { ErrorHandlerComponent } from './components/error-handler/error-handler.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
  imports: [ReactiveFormsModule, ErrorHandlerComponent],
})
export class LandingComponent {
  apolloService = inject(Apollo);

  userName = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(20),
    Validators.pattern(/^\d+/),
  ]);

  onSubmit() {
    console.log(this.userName);
    this.userName.reset();
  }
}
