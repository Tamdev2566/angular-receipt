import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from '../../../services/alertService/alert';
import { ModuleService } from '../../../services/module-service/module-service';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Navbar, Sidebar, CommonModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  constructor(
    private router: Router,
    private alertService: AlertService,
    public stateService: ModuleService,
  ) {}

  isGlobalLoading: boolean = false;
  isSidebarOpen: boolean = false;
  showReceiptModal = false;
  modalOpen = false;
  private sub: Subscription = new Subscription();

  ngOnInit() {
    this.sub = this.stateService.modalState$.subscribe((state) => {
      this.modalOpen = state;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  handleGlobalLogout() {
    this.isGlobalLoading = true;

    setTimeout(() => {
      this.isGlobalLoading = false;
      localStorage.removeItem('angular_token');
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
      this.alertService.showAlert('Success', 'You have been Logged Out Successfully!', 'success');
    }, 1000);
  }
}
