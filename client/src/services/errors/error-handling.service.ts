import { Injectable, signal, WritableSignal } from '@angular/core';
import { createFallbackError, ErrorStatus, FallbackError } from './errorTypes';

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

  showError(error: ErrorStatus, fbError?: FallbackError) {
    const { fbStatus, fbMessage } = createFallbackError(fbError);

    this.errorStatus.set({
      httpError: !error?.httpError ? fbStatus : error.httpError,
      message: error?.message ?? 'Unknown',
      description:
        error?.description == 'Unknown Error' ? fbMessage : error.description,
    });
  }
  hideError = () => this.errorStatus.set(null);
}
