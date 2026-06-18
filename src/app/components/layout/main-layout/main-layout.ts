import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AlertService } from '../../../services/alertService/alert';
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
  ) {}

  isGlobalLoading: boolean = false;
  isSidebarOpen: boolean = false;
  showReceiptModal = false;

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
      this.alertService.showAlert('You have been Logged Out Successfully!', '', 'success');
    }, 1000);
  }
}
