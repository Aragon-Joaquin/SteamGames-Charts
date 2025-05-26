import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';

import { SearchUserAdapted } from '../../adapters/responses';
import { SteamContextService } from '../../services';
import { ApicallsService } from '../../services/endpoints/apicalls.service';
import { HTTPPaths, SEARCH_USER } from '../../services/endpoints/endpoints';
import { ErrorHandlerComponent } from './components/error-handler/error-handler.component';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
  imports: [ReactiveFormsModule, ErrorHandlerComponent],
})
export class LandingComponent implements OnInit, OnDestroy {
  private apiCalls = inject(ApicallsService);
  private SteamContext = inject(SteamContextService);
  private router = inject(Router);

  userName = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  lastVal: string = '';
  searchInput = new Subject<string>();
  showUsers = signal<SearchUserAdapted[] | []>([
    {
      avatarfull: '',
      lastlogoff: 2,
      persona_name: 'john doe',
      profile_url: 'john doe',
      steamid: '2',
    },
    {
      avatarfull: '',
      lastlogoff: 2,
      persona_name: 'john doe',
      profile_url: 'doe',
      steamid: '2',
    },
  ]);

  ngOnInit(): void {
    this.searchInput.pipe(debounceTime(500)).subscribe((inputVal) => {
      this.showUsers.set([]);
      this.userName.patchValue(inputVal, { onlySelf: true });
      if (!this.userName.valid) return;

      const results = this.apiCalls.POSTHttpEndpoint<typeof SEARCH_USER>(
        HTTPPaths.searchUser,
        {
          VanityUrl: inputVal,
        }
      );

      results?.subscribe((el) => {
        console.log(el);
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

  onErrorImg(e: Event) {
    (e.target as HTMLImageElement).src = 'img/not-found.webp';
    console.log((e.target as HTMLImageElement).src);
  }

  onClickUser(e: Event, idx: number) {
    e.preventDefault();
    const getUser = this.showUsers()[idx];

    if (getUser == null) return;
    this.SteamContext.currentUser.next(getUser);
    this.router.navigateByUrl(`/dashboard/${getUser.profile_url ?? ''}`);
  }
}
