import { Injectable, signal, WritableSignal } from '@angular/core';

interface ErrorStatus {
  httpError: number;
  message?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  constructor() {}

  public readonly errorStatus: WritableSignal<ErrorStatus | null> =
    signal<ErrorStatus | null>(null);

  showError = (error: ErrorStatus) => this.errorStatus.set(error);
  hideError = () => this.errorStatus.set(null);
}
