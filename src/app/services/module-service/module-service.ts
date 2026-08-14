import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, retry } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../authService/auth.service';
import { MenuAccessService } from '../menu-access';

export interface SubMenu {
  title: string;
  link: string;
}

export interface MenuItem {
  title: string;
  icon?: string;
  link?: string;
  hasSubmenu: boolean;
  isExpanded?: boolean;
  submodules?: SubMenu[];
  menuId?: string;
  menuName?: string;
  menuLink?: string;
}

export interface ApiMenuItem {
  menuId: string;
  menuName: string;
  menuLink: string;
  menuParent: string;
  menuIconString: string;
  menuOrder: number;
  mandatory: string;
  fullAccess: number;
  canRead: number;
}

@Injectable({ providedIn: 'root' })
export class ModuleService {
  private modalState = new BehaviorSubject<boolean>(false);
  modalState$ = this.modalState.asObservable();

  private menuListSubject = new BehaviorSubject<MenuItem[]>([]);
  menuList$ = this.menuListSubject.asObservable();

  private menuAccessService = inject(MenuAccessService);

  constructor(private authService: AuthService) {}

  getModalState(): boolean {
    return this.modalState.getValue();
  }

  setModalState(isOpen: boolean) {
    this.modalState.next(isOpen);
  }

  getMenus(): MenuItem[] {
    return this.menuListSubject.getValue();
  }

  fetchUserMenus(usersLocationId: string): Observable<ApiMenuItem[]> {
    return this.authService.getAppMenus(usersLocationId).pipe(
      retry({ count: 1, delay: 500 }),
      tap((apiItems: ApiMenuItem[]) => {
        if (apiItems && apiItems.length > 0) {
          this.menuAccessService.setMenuList(apiItems as any);
        }

        this.setMenuItemsFromApi(apiItems);
      }),
      catchError((err) => {
        console.error('Failed to load dynamic menus', err);
        return of([]);
      }),
    );
  }

  setMenuItemsFromApi(apiItems: ApiMenuItem[]) {
    if (!apiItems || apiItems.length === 0) {
      this.menuListSubject.next([]);
      return;
    }

    const dynamicTree = this.transformApiToDynamicTree(apiItems);
    this.menuListSubject.next(dynamicTree);
  }

  private capitalizeTitle(text: string): string {
    if (!text) return '';
    return text
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private transformApiToDynamicTree(apiItems: ApiMenuItem[]): MenuItem[] {
    const parents = apiItems.filter((item) => item.menuId === item.menuParent);
    const children = apiItems.filter((item) => item.menuId !== item.menuParent);

    parents.sort((a, b) => a.menuOrder - b.menuOrder);

    const resultMenus: MenuItem[] = [];

    for (const parent of parents) {
      const allowedChildren = children
        .filter((child) => child.menuParent === parent.menuId && this.canRead(child.canRead))
        .sort((a, b) => a.menuOrder - b.menuOrder);

      const hasValidChildren = allowedChildren.length > 0;
      const isParentReadable = this.canRead(parent.canRead);

      if (hasValidChildren) {
        resultMenus.push({
          title: this.capitalizeTitle(parent.menuName),
          icon: parent.menuIconString || 'fa-solid fa-folder',
          hasSubmenu: true,
          isExpanded: false,
          submodules: allowedChildren.map((child) => ({
            title: this.capitalizeTitle(child.menuName),
            link: child.menuLink,
          })),
        });
      } else if (isParentReadable && parent.menuLink && parent.menuLink !== '-') {
        resultMenus.push({
          title: this.capitalizeTitle(parent.menuName),
          icon: parent.menuIconString ? `fa-solid fa-${parent.menuIconString}` : 'fa-solid fa-link',
          link: parent.menuLink,
          hasSubmenu: false,
          isExpanded: false,
          submodules: [],
        });
      }
    }

    return resultMenus;
  }

  private canRead(value: unknown): boolean {
    return value === true || value === 1 || String(value).trim().toUpperCase() === 'Y' || String(value).trim() === '1';
  }
}
