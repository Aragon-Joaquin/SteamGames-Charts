import { Component, input } from '@angular/core';
import { AdaptedGraphqlTypes } from '../../../../../adapters/graphqlAdapter';
import { GRAPHQL_ENDPOINTS } from '../../../../../services/endpoints';

@Component({
  selector: 'overview-never-played',
  imports: [],
  template: `
    @if(game().playtime_forever < 10) {
    <div class="game">
      <span>
        <img
          [src]="
            'http://media.steampowered.com/steamcommunity/public/images/apps/' +
            game().appid +
            '/' +
            game().img_icon_url +
            '.jpg'
          "
          alt="{{ game().name }} icon"
        />
        <h3 [title]="game().name">{{ game().name }}</h3>
      </span>
      <p>{{ game().playtime_forever }}m played</p>
    </div>
    }
  `,
  styles: `
    .game {
      position: relative;
      display: flex;
      margin: auto;
      flex-direction: column;
      background: var(--white1-color);
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      padding: 8px 30px 8px 10px;
      margin-bottom: 16px;
      transition: box-shadow 0.2s;

      &:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,0.10);
      }
    }

    .game > span {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;

      & > h3 {
      font-size: 1.15em;
      font-weight: 600;
      margin: 0;
      color: #222;
      letter-spacing: 0.01em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    & > img {
      aspect-ratio: 1/1;
      object-fit: cover;
      width: 38px;
      height: 38px;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
      background: #fff;
    }
    }

    .game p {
      position: absolute;
      right: 6px;
      bottom: 2px;
      margin: 0;
      font-size: 0.9em;

      color: var(--textDescriptive);
    }
  `,
})
export class GamesNeverPlayedComponent {
  game =
    input.required<
      AdaptedGraphqlTypes<
        typeof GRAPHQL_ENDPOINTS.UserOwnedGames
      >['games'][number]
    >();
}
