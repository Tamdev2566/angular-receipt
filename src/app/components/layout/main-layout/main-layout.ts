import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoaderComponent } from '../../../shared/loader/loader';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';
import { AlertMessage } from '../../../shared/alert/alert';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent, AlertMessage, Navbar, Sidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  constructor(private router: Router) {}

  isGlobalLoading: boolean = false;

  handleGlobalLogout() {
    this.isGlobalLoading = true;

    setTimeout(() => {
      this.isGlobalLoading = false;
      this.router.navigate(['/login']);
    }, 5000);
  }
}
