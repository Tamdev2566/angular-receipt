import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/userService/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  standalone: true,
  imports: [CommonModule],
})
export class Navbar {
  isCardOpen = false;
  isSearchFocused = false;

  @Output() logoutTriggered = new EventEmitter<void>();

  user: any;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUser();
    console.log(this.user);
  }
  toggleAccountCard(event: Event): void {
    event.stopPropagation();
    this.isCardOpen = !this.isCardOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isCardOpen = false;
    }
  }

  onHomeClick(): void {
    this.isCardOpen = false;
    this.router.navigate(['/home']);
  }

  onNotificationClick(): void {}

  onAccountSettings(): void {
    this.isCardOpen = false;
    this.router.navigate(['/account-settings']);
  }

  onChangePassword(): void {
    this.isCardOpen = false;
    this.router.navigate(['/change-password']);
  }

  onLogout(): void {
    this.isCardOpen = false;
    this.logoutTriggered.emit();
  }
}
