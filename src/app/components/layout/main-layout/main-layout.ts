import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { LoaderComponent } from '../../../shared/loader/loader';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';
import { AlertMessage } from '../../../shared/alert/alert';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent, AlertMessage, Navbar, Sidebar, CommonModule], 
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  constructor(private router: Router) {}

  isGlobalLoading: boolean = false;
  isSidebarOpen: boolean = false; 

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  handleGlobalLogout() {
    this.isGlobalLoading = true;

    setTimeout(() => {
      this.isGlobalLoading = false;
      this.router.navigate(['/login']);
    }, 5000);
  }
}