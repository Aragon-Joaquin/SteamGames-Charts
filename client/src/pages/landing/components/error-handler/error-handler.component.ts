import { Component, input } from '@angular/core';

@Component({
  selector: 'form-error-message',
  imports: [],
  template: `<p class="formError">{{ errorName() }}</p>`,
  styles: `
  .formError {
    font-family: sans-serif;
    font-size: 0.9em;
    font-weight: 600;
    color: var(--errorColor);
  }
  `,
})
export class ErrorHandlerComponent {
  errorName = input<string | null>('Unknown Error');
}
