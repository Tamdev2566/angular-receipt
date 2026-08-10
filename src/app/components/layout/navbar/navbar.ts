import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModuleService, MenuItem } from '../../../services/module-service/module-service';
import { UserService } from '../../../services/userService/user.service';
import { AuthService } from '../../../services/authService/auth.service';
import { AlertService } from '../../../services/alertService/alert';
import { ChangePasswordPage } from '../../change-password/change-password';
import { Combobox, ComboboxSelection } from '../../../shared/combobox/combobox';
import { MenuAccessService } from '../../../services/menu-access';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ChangePasswordPage, Combobox],
})
export class Navbar implements OnInit, OnDestroy {
  isCardOpen = false;
  isSearchFocused = false;
  showPasswordModal = false;

  showLocationModal = false;
  locationsList: any[] = [];
  selectedLocationId: string | number | null = null;
  selectedLocationObj: any | null = null;

  isForcedNavbar = false;

  @Output() logoutTriggered = new EventEmitter<void>();
  @Output() changeLocationTriggered = new EventEmitter<void>();

  user: any;
  searchData: { title: string; link: string }[] = [];
  searchText = '';
  filteredMenus: { title: string; link: string }[] = [];

  private menuSubscription?: Subscription;
  private menuAccessService = inject(MenuAccessService);

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private userService: UserService,
    private moduleService: ModuleService,
    private authService: AuthService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.loadLocationsFromStorage();
    this.menuSubscription = this.moduleService.menuList$.subscribe((menus: MenuItem[]) => {
      if (menus && menus.length > 0) {
        this.extractSearchData(menus);
      }
    });

    this.fetchActiveLocationMenus();
    this.isForcedNavbar = localStorage.getItem('passwordExpired') === 'true';
    if (this.isForcedNavbar) {
      this.showPasswordModal = true;
    }
  }

  private loadLocationsFromStorage(): void {
    const storedLocations = localStorage.getItem('locationList');
    if (storedLocations) {
      try {
        this.locationsList = JSON.parse(storedLocations);
      } catch (e) {
        console.error('Error parsing locationList from localStorage', e);
        this.locationsList = [];
      }
    }

    const defaultLocStr = localStorage.getItem('defaultLocation');
    const defaultLoc = defaultLocStr ? JSON.parse(defaultLocStr) : null;

    if (defaultLoc?.usersLocationId || defaultLoc?.locationId) {
      this.selectedLocationId = defaultLoc.usersLocationId || defaultLoc.locationId;
      this.selectedLocationObj = defaultLoc;
    } else if (this.user?.usersLocationId || this.user?.locationId) {
      this.selectedLocationId = this.user.usersLocationId || this.user.locationId;
      this.selectedLocationObj =
        this.locationsList.find(
          (loc) =>
            loc.usersLocationId === this.selectedLocationId ||
            loc.locationId === this.selectedLocationId,
        ) || null;
    } else if (this.locationsList.length > 0) {
      this.selectedLocationId =
        this.locationsList[0].usersLocationId || this.locationsList[0].locationId;
      this.selectedLocationObj = this.locationsList[0];
    }
  }

  private fetchActiveLocationMenus(): void {
    const defaultLocStr = localStorage.getItem('defaultLocation');
    const defaultLoc = defaultLocStr ? JSON.parse(defaultLocStr) : null;

    const activeLocationId =
      defaultLoc?.usersLocationId ||
      defaultLoc?.locationId ||
      this.selectedLocationId ||
      this.user?.usersLocationId ||
      this.user?.locationId ||
      this.locationsList[0]?.usersLocationId ||
      this.locationsList[0]?.locationId;

    if (activeLocationId) {
      this.authService.getAppMenus(activeLocationId).subscribe({
        next: (menuApiData: any) => {
          this.moduleService.setMenuItemsFromApi(menuApiData);
          this.menuAccessService.setMenuList(menuApiData);
          this.menuAccessService.checkPermissionForUrl(this.router.url);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to fetch dynamic menus on page load/refresh', err);
        },
      });
    } else {
      console.warn('No activeLocationId found to fetch dynamic menus');
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

  onChangeLocation(): void {
    this.isCardOpen = false;
    this.loadLocationsFromStorage();
    this.showLocationModal = true;
  }

  closeLocationModal(): void {
    this.showLocationModal = false;
  }

  onLocationComboboxChange(selection: ComboboxSelection): void {
    if (selection) {
      this.selectedLocationId = selection.value;
      this.selectedLocationObj = selection.item;
    }
  }

  onSaveLocation(): void {
    if (!this.selectedLocationId || !this.selectedLocationObj) {
      return;
    }

    const newLocationId =
      this.selectedLocationObj.usersLocationId || this.selectedLocationObj.locationId;
    const newLocationName =
      this.selectedLocationObj.locationName || this.selectedLocationObj.location;

    const updatedUser = {
      ...this.user,
      userLocation: newLocationName,
      usersLocationId: newLocationId,
      locationId: newLocationId,
    };

    this.userService.setUser(updatedUser);
    this.user = updatedUser;

    localStorage.setItem('defaultLocation', JSON.stringify(this.selectedLocationObj));

    if (newLocationId) {
      this.authService.getAppMenus(newLocationId).subscribe({
        next: (menuApiData: any) => {
          this.moduleService.setMenuItemsFromApi(menuApiData);
          this.menuAccessService.setMenuList(menuApiData);
          this.menuAccessService.checkPermissionForUrl(this.router.url);
          this.alertService.showAlert('Success', 'Location Changed Successfully!', 'success');
          this.changeLocationTriggered.emit();
          this.closeLocationModal();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.alertService.showAlert('Error', 'Failed to update location menus', 'error');
        },
      });
    } else {
      this.closeLocationModal();
    }
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
