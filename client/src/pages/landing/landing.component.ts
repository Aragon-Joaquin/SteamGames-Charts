import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, interval, Subject } from 'rxjs';

import { SearchUserAdapted } from '../../adapters/responses';
import { SteamContextService } from '../../services';
import { ApicallsService } from '../../services/endpoints/apicalls.service';
import { HTTPPaths, SEARCH_USER } from '../../services/endpoints/endpoints';
import { UNIX_RESPONSES } from '../../utils';
import { ErrorHandlerComponent } from './components/error-handler/error-handler.component';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
  imports: [ReactiveFormsModule, ErrorHandlerComponent],
})
export class LandingComponent implements OnInit, OnDestroy, AfterViewInit {
  private apiCalls = inject(ApicallsService);
  private SteamContext = inject(SteamContextService);
  private router = inject(Router);

  userName = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  lastVal: string = '';
  searchInput = new Subject<string>();
  showUsers = signal<SearchUserAdapted[] | []>([]);
  totalUsers = signal<{
    last_update: UNIX_RESPONSES;
    peakToday: number;
    concurrentNow: number;
  } | null>(null);

  ngOnInit(): void {
    this.apiCalls.GETHttpEndpoint(HTTPPaths.totalUsers)?.subscribe((res) => {
      return this.totalUsers.set({
        last_update: res?.last_update ?? '???',
        concurrentNow:
          res?.Ranks.reduce(
            (acc, { concurrent_in_game }) => acc + concurrent_in_game,
            0
          ) ?? 0,
        peakToday:
          res?.Ranks.reduce((acc, { peak_in_game }) => acc + peak_in_game, 0) ??
          0,
      });
    });

    this.searchInput.pipe(debounceTime(700)).subscribe((inputVal) => {
      this.showUsers.set([]);
      this.userName.patchValue(inputVal, { onlySelf: true });
      if (!this.userName.valid) return;

      const results = this.apiCalls.POSTHttpEndpoint<
        typeof SEARCH_USER,
        typeof HTTPPaths.searchUser
      >(HTTPPaths.searchUser, {
        VanityUrl: inputVal,
      });

      results?.subscribe((el) => {
        return this.showUsers.set(el ?? []);
      });
    });
  }

  ngOnDestroy(): void {
    this.searchInput.complete();
  }

  onInputChange(e: Event) {
    const inputVal = (e.target as HTMLInputElement)?.value;
    if (inputVal == null || this.lastVal == inputVal) return;

    this.lastVal = inputVal;
    this.searchInput.next(inputVal);
  }

  onErrorImg = (e: Event) =>
    ((e.target as HTMLImageElement).src = 'img/not-found.webp');

  onClickUser(e: Event, idx: number) {
    e.preventDefault();
    const getUser = this.showUsers()[idx];

    if (getUser == null) return;
    this.SteamContext.currentUser.next(getUser);
    this.router.navigateByUrl(`/dashboard/${getUser.profile_url ?? ''}`);
  }
  @ViewChild('imageContainer')
  private imageContainer!: ElementRef<HTMLDivElement>;
  private imageShow() {
    const parentElement = this.imageContainer.nativeElement;
    const [imgOne, imgTwo]: HTMLImageElement[] = [
      parentElement.children.item(0) as HTMLImageElement,
      parentElement.children.item(1) as HTMLImageElement,
    ];
    const allImagesSrc = [
      'ror2.webp',
      'factorio.webp',
      'metroredux.webp',
      'terraria.webp',
      'ultrakill.webp',
      'yomi.png',
      'csgo.webp',
    ];

    const getName = (idx: number) => allImagesSrc[idx % allImagesSrc.length];

    //! if rxjs gets tedious, i'll use the setInterval
    interval(5000).subscribe((idx) => {
      const currentName = getName(idx);
      if (idx % 2 == 0) {
        imgTwo.src = `/img/landing-games/${currentName}`;
        imgTwo.title = currentName.split('.')[0];
        imgOne.classList.replace('visible', 'invisible');
      } else {
        imgOne.src = `/img/landing-games/${currentName}`;
        imgOne.title = currentName.split('.')[0];
        imgOne.classList.replace('invisible', 'visible');
      }
    });
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') this.imageShow();
  }
}
