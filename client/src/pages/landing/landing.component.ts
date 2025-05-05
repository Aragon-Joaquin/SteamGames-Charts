import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorHandlerComponent } from './components/error-handler/error-handler.component';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
  imports: [ReactiveFormsModule, ErrorHandlerComponent],
})
export class LandingComponent implements OnInit {
  apolloService = inject(Apollo);

  userName = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(20),
    Validators.pattern(/^\d+/),
  ]);

  onSubmit() {
    this.userName.reset();
  }

  ngOnInit(): void {
    //! just to try
    this.apolloService
      .watchQuery({
        query: gql`
          {
            __type(name: "String") {
              name
              description
              specifiedByURL
              isOneOf
            }
          }
        `,
      })
      .valueChanges.subscribe((vals) => {
        console.log(vals);
      });
  }
}
