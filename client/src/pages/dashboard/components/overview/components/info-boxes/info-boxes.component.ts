import { Component, input } from '@angular/core';

@Component({
  selector: 'overview-info-boxes',
  imports: [],
  template: `<div class="info-box">
    <span class="info-title">
      @if (svgName() != null) {
      <img [src]="'/svgs/' + svgName" [alt]="this.boxTitle()" />
      }
      <h5 class="lmao">{{ boxTitle() }}</h5>
    </span>
    <span class="info-stats">
      <strong class="important-data">{{
        numberShown() != '' ? numberShown() : 'Error'
      }}</strong>
    </span>
  </div> `,
  styles: `
  .info-box {
    width: 175px;
    display: flex;
    flex-direction: column;
    padding: 15px 20px;
    border: 1px solid var(--white2-color);
    border-radius: 8px; 
  }

  .info-title {

    & > h5 {

      color: var(--white2-color)
    }
  }

  .info-stats {
    & > .important-data {
      font-size: 1.5em;
      font-family: var(--Poppins-bold);
      text-wrap: nowrap;
      color: var(--dark3-color)
    }
  }

  `,
})
export class InfoBoxesComponent {
  boxTitle = input.required<string>();
  numberShown = input.required<number | string>();
  svgName = input<string | null>(null);
}
