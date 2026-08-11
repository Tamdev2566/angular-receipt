import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.scss'],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  todayDate: string = '';
  currentTime: string = '';
  private timer: any;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.updateDateTime();

    this.timer = setInterval(() => {
      this.updateDateTime();
      this.cdr.detectChanges();
    }, 1000);
  }

  updateDateTime(): void {
    const now = new Date();

    this.todayDate = now.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    this.currentTime = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  onViewReports(): void {
    this.router.navigate(['/main/dashboard']);
  }

  onCreateReceipt(): void {
    this.router.navigate(['/main/new-receipt']);
  }
}
