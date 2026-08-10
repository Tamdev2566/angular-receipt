import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AlertService } from './alertService/alert';

@Injectable({
  providedIn: 'root',
})
export class AutoLogoutService {
  private userActivitySubscription!: Subscription;

  private readonly INACTIVITY_TIME = 20 * 60 * 1000;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private alert: AlertService,
  ) {}

  public startMonitoring(): void {
    this.ngZone.runOutsideAngular(() => {
      const userActivity$ = merge(
        fromEvent(window, 'mousemove'),
        fromEvent(window, 'click'),
        fromEvent(window, 'keydown'),
        fromEvent(window, 'scroll'),
        fromEvent(window, 'touchstart'),
      );

      this.userActivitySubscription = userActivity$
        .pipe(switchMap(() => timer(this.INACTIVITY_TIME)))
        .subscribe(() => {
          this.ngZone.run(() => {
            this.logoutUser();
          });
        });
    });
  }

  private logoutUser(): void {
    this.stopMonitoring();

    localStorage.removeItem('token');
    sessionStorage.clear();
    localStorage.removeItem('receipt_token');
    localStorage.removeItem('receipt_token_expire');
    localStorage.removeItem('user');
    localStorage.removeItem('passwordExpired');
    localStorage.removeItem('defaultLocation');
    localStorage.removeItem('locationList');

    this.alert.showAlert('Error', 'You have been logged out due to inactivity.', 'error');

    this.router.navigate(['/login']);
  }

  public stopMonitoring(): void {
    if (this.userActivitySubscription) {
      this.userActivitySubscription.unsubscribe();
    }
  }
}
