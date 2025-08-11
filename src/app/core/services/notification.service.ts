import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private loading = false;
  private loadingListeners: ((loading: boolean) => void)[] = [];

  constructor() { }

  setLoading(isLoading: boolean) {
    this.loading = isLoading;
    this.loadingListeners.forEach(listener => listener(isLoading));
  }

  onLoadingChange(listener: (loading: boolean) => void) {
    this.loadingListeners.push(listener);
  }

  showError(message: string) {
    // Implementación básica, puedes reemplazar por un snackbar/toast
    alert(message);
  }
}
