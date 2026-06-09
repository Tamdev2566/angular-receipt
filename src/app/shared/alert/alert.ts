import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, AlertConfig } from '../../services/alertService/alert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrls: ['./alert.scss'],
})
export class AlertMessage implements OnInit, OnDestroy {
  visible: boolean = false;
  type: string = 'success';
  title: string = '';
  message: string = '';

  private alertSubscription!: Subscription;

  constructor(
    private alertService: AlertService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.alertSubscription = this.alertService.alertState$.subscribe({
      next: (state: AlertConfig) => {
        setTimeout(() => {
          this.visible = state.visible;
          this.type = state.type;
          this.title = state.title;
          this.message = state.message;
          this.cdr.detectChanges();
        });
      },
    });
  }

  dismiss(): void {
    this.alertService.clearAlert();
  }

  ngOnDestroy(): void {
    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe();
    }
  }
}
