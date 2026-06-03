import { Component, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
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
  isCardOpen = false;

  isSearchFocused: boolean = false;

  @Output() logoutTriggered = new EventEmitter<void>();

  constructor(
    private router: Router,
    private elementRef: ElementRef,
  ) {}

  toggleAccountCard(): void {
    this.isCardOpen = !this.isCardOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isCardOpen = false;
    }
  }

  onLogout(): void {
    this.logoutTriggered.emit();
  }

  onHomeClick(): void {
    this.router.navigate(['/home']);
  }

  onNotificationClick(): void {}

  onAccountSettings(): void {}

  onChangePassword(): void {}
}
