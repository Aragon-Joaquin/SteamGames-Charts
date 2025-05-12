import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { debounceTime, Subject } from 'rxjs';
import { STEAM_ID_DIGITS } from '../../utils/constants';
import { ErrorHandlerComponent } from './components/error-handler/error-handler.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
  imports: [ReactiveFormsModule, ErrorHandlerComponent],
})
export class LandingComponent implements OnInit, OnDestroy {
  apolloService = inject(Apollo);

  userName = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(20),
    Validators.pattern(/^\d+/),
  ]);

  searchInput = new Subject<string>();
  ngOnInit(): void {
    this.searchInput.pipe(debounceTime(500)).subscribe((inputVal) => {
      console.log(inputVal);
    });
  }

  ngOnDestroy(): void {
    this.searchInput.complete();
  }

  onSubmit(e: Event) {
    e.preventDefault();
    console.log(this.userName);
  }

  onInputChange(e: Event) {
    const inputVal = e.target as HTMLInputElement;
    console.log(inputVal?.value.length);
    if (inputVal?.value == null || inputVal.value.length != STEAM_ID_DIGITS)
      return;

    this.searchInput.next(inputVal.value);
  }
}
