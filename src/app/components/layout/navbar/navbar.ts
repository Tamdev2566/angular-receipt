import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModuleService, MenuItem, SubMenu } from '../../../services/module-service/module-service';
import { UserService } from '../../../services/userService/user.service';
import { ChangePasswordPage } from '../../change-password/change-password';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  standalone: true,
  imports: [CommonModule, ChangePasswordPage],
})
export class Navbar implements OnInit, OnDestroy {
  isCardOpen = false;
  isSearchFocused = false;
  showPasswordModal = false;

  isForcedNavbar = false;

  @Output() logoutTriggered = new EventEmitter<void>();

  user: any;
  searchData: { title: string; link: string }[] = [];
  searchText = '';
  filteredMenus: { title: string; link: string }[] = [];

  private menuSubscription?: Subscription;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private userService: UserService,
    private moduleService: ModuleService,
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUser();

    this.menuSubscription = this.moduleService.menuList$.subscribe((menus: MenuItem[]) => {
      if (menus && menus.length > 0) {
        this.extractSearchData(menus);
      }
    });

    this.isForcedNavbar = localStorage.getItem('passwordExpired') === 'true';
    if (this.isForcedNavbar) {
      this.showPasswordModal = true;
    }
  }

  private extractSearchData(menus: MenuItem[]): void {
    const searchItems: { title: string; link: string }[] = [];

    menus.forEach((item) => {
      if (item.link) {
        searchItems.push({ title: item.title, link: item.link });
      }
      if (item.submodules && item.submodules.length > 0) {
        item.submodules.forEach((sub) => {
          searchItems.push({ title: sub.title, link: sub.link });
        });
      }
    });

    this.searchData = searchItems;
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

    this.filteredMenus = this.searchData.filter((item) =>
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
    this.router.navigate(['/main']);
  }

  onNotificationClick(): void {}

  onAccountSettings(): void {
    this.isCardOpen = false;
    this.router.navigate(['/account-settings']);
  }

  onChangePassword(): void {
    this.isCardOpen = false;
    this.isForcedNavbar = false;
    this.showPasswordModal = true;
  }

  onPasswordUpdatedSuccessfully(payload: any): void {
    this.showPasswordModal = false;
  }

  onLogout(): void {
    this.isCardOpen = false;
    this.logoutTriggered.emit();
  }

  ngOnDestroy(): void {
    if (this.menuSubscription) {
      this.menuSubscription.unsubscribe();
    }
  }
}
