import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.scss'],
})
export class WelcomeComponent {
  constructor(private router: Router) {}

  navigateToDashboard(): void {
    // this.router.navigate(['/dashboard']);
  }
}
