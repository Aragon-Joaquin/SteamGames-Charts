import { Component, input } from '@angular/core';

@Component({
  selector: 'form-error-message',
  imports: [],
  template: `<p class="formError">{{ errorName() }}</p>`,
  styles: `
  .formError {

  }
  `,
})
export class ErrorHandlerComponent {
  errorName = input<string | null>('Unknown Error');
}
