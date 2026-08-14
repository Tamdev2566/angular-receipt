import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AlertService } from '../../../services/alertService/alert';
import { ModuleService } from '../../../services/module-service/module-service';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';
import { ApiService } from '../../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Navbar, Sidebar, CommonModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  baseUrl = environment.loginURL;

  isGlobalLoading: boolean = false;
  isSidebarOpen: boolean = false;
  showReceiptModal = false;
  modalOpen = false;
  private sub: Subscription = new Subscription();

  constructor(
    private router: Router,
    private alertService: AlertService,
    public stateService: ModuleService,
    private api: ApiService,
  ) {}

  ngOnInit(): void {
    this.sub = this.stateService.modalState$.subscribe((state) => {
      this.modalOpen = state;
    });

    this.loadMenusForActiveLocation();
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  private loadMenusForActiveLocation(): void {
    try {
      const defaultLocation = JSON.parse(localStorage.getItem('defaultLocation') || 'null');
      const locations = JSON.parse(localStorage.getItem('locationList') || '[]');
      const activeLocation = defaultLocation || locations[0];
      const userLocationId = activeLocation?.usersLocationId || activeLocation?.locationId;

      if (userLocationId) {
        this.stateService.fetchUserMenus(String(userLocationId)).subscribe();
      }
    } catch (error) {
      console.error('Error reading the active location from storage', error);
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  handleGlobalLogout(): void {
    this.isGlobalLoading = true;

    this.http
      .post(`${this.baseUrl}/api/logout`, {})
      .pipe(
        finalize(() => {
          this.isGlobalLoading = false;
          this.clearSessionAndRedirect();
        }),
      )
      .subscribe({
        next: (response: any) => {
          this.alertService.showAlert('Success', response.message, 'success');
        },
        error: (err) => {
          this.alertService.showAlert('Error', err.error.message, 'error');
        },
      });
  }

  private clearSessionAndRedirect(): void {
    localStorage.removeItem('receipt_token');
    localStorage.removeItem('receipt_token_expire');
    localStorage.removeItem('user');
    localStorage.removeItem('passwordExpired');
    localStorage.removeItem('defaultLocation');
    localStorage.removeItem('locationList');

    this.router.navigate(['/login']);
    // this.alertService.showAlert('Success', 'You have been Logged Out Successfully!', 'success');
  }
}
