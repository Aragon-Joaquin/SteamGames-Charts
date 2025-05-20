import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { ApicallsService } from '../../services/apicalls.service';
import { HTTPPaths, SEARCH_USER } from '../../services/endpoints';
import { ErrorHandlerComponent } from './components/error-handler/error-handler.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
  imports: [ReactiveFormsModule, ErrorHandlerComponent],
})
export class LandingComponent implements OnInit, OnDestroy {
  apiCalls = inject(ApicallsService);

  userName = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(20),
    Validators.pattern(/^\d+/),
  ]);

  lastVal: string = '';

  searchInput = new Subject<string>();
  ngOnInit(): void {
    this.searchInput.pipe(debounceTime(500)).subscribe((inputVal) => {
      this.apiCalls.POSTHttpEndpoint<typeof SEARCH_USER>(HTTPPaths.searchUser, {
        VanityUrl: inputVal,
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
}
