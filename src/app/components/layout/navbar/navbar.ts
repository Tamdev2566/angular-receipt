import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  standalone: true,
  imports: [CommonModule],
})
export class Navbar {
  constructor(private router: Router) {}

  @Output() logoutTriggered = new EventEmitter<void>();

  isCardOpen = false;

  toggleAccountCard() {
    this.isCardOpen = !this.isCardOpen;
  }

  onLogout() {
    this.logoutTriggered.emit();
  }

  onHomeClick() {}

  onNotificationClick() {}

  onAccountSettings() {}

  onChangePassword() {}
}
