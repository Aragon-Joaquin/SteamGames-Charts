import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'components-loader',
  encapsulation: ViewEncapsulation.None,
  imports: [],
  template: `
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  `,
  styles: `
     .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 200px;
      }
      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #ddd;
        border-top: 4px solid #555;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 12px;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
  `,
})
export class LoaderComponent {}
