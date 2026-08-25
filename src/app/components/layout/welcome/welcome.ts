import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModuleService } from '../../../services/module-service/module-service';
import { CommonModule } from '@angular/common';
import { MenuAccessService } from '../../../services/menu-access';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.scss'],
  imports: [CommonModule],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  todayDate: string = '';
  currentTime: string = '';
  canCreateReceipt = false;
  canViewOverview = false;
  private timer: any;
  private menuSubscription?: Subscription;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private moduleService: ModuleService,
    private menuAccessService: MenuAccessService,
  ) {}

  ngOnInit(): void {
    this.updateDateTime();
    this.menuSubscription = this.moduleService.menuList$.subscribe(() => {
      this.canCreateReceipt = this.menuAccessService.hasScreenAccess('/main/receipts', true);
      this.canViewOverview = this.menuAccessService.hasScreenAccess('/main/dashboard', true);
      this.cdr.detectChanges();
    });

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
    this.menuSubscription?.unsubscribe();
  }

  onViewReports(): void {
    if (!this.canViewOverview) return;
    this.router.navigate(['/main/dashboard']);
  }

  onCreateReceipt(): void {
    if (!this.canCreateReceipt) return;
    this.router.navigate(['/main/new-receipt']);
  }
}
