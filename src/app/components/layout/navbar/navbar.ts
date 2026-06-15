import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ModuleService } from '../../../services/module-service/module-service';
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
  searchData: any;
  searchText = '';
  filteredMenus: any[] = [];

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private userService: UserService,
    private moduleService: ModuleService,
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.searchData = this.moduleService.getMenus().flatMap((item) => item.submodules || []);
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

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.searchText = value;

    if (!value.trim()) {
      this.filteredMenus = [];
      return;
    }

    this.filteredMenus = this.searchData.filter((item: any) =>
      item.title.toLowerCase().includes(value.toLowerCase()),
    );
  }

  navigateTo(link: string): void {
    this.searchText = '';
    this.filteredMenus = [];

    this.router.navigate([link]);
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
