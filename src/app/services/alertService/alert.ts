import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AlertConfig {
  visible: boolean;
  type: string;
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertSource = new BehaviorSubject<AlertConfig>({
    visible: false,
    type: 'success',
    title: '',
    message: '',
  });

  alertState$ = this.alertSource.asObservable();

  showAlert(title: string, message: string, type: string = 'success'): void {
    this.alertSource.next({ visible: true, title, message, type });

    setTimeout(() => {
      this.clearAlert();
    }, 4000);
  }

  clearAlert(): void {
    this.alertSource.next({
      visible: false,
      type: 'success',
      title: '',
      message: '',
    });
  }
}
