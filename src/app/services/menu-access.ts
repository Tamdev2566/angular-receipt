import { Injectable, signal, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface MenuItem {
  menuId: string;
  menuName: string;
  menuLink: string;
  menuParent: string;
  menuIconString: string;
  menuOrder: number;
  mandatory: string;
  fullAccess: number | string | boolean;
  canRead: number | string | boolean;
  submodules?: MenuItem[];
  modules?: MenuItem[];
  groups?: MenuItem[];
  menus?: MenuItem[];
}

@Injectable({
  providedIn: 'root',
})
export class MenuAccessService {
  private router = inject(Router);

  private menuList = signal<MenuItem[]>([]);
  public currentPermission = signal<{ fullAccess: boolean; canRead: boolean }>({
    fullAccess: false,
    canRead: false,
  });

  constructor() {
    const stored = localStorage.getItem('app_user_menus');
    if (stored) {
      try {
        this.menuList.set(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing stored menus', e);
      }
    }

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkPermissionForUrl(event.urlAfterRedirects || event.url);
      });
  }

  setMenuList(data: MenuItem[]) {
    if (data && data.length > 0) {
      localStorage.setItem('app_user_menus', JSON.stringify(data));
      this.menuList.set(data);
      this.checkPermissionForUrl(this.router.url);
    }
  }

  checkPermissionForUrl(currentUrl: string) {
    let list = this.menuList();

    if (!list || list.length === 0) {
      const stored = localStorage.getItem('app_user_menus');
      if (stored) {
        try {
          list = JSON.parse(stored);
          this.menuList.set(list);
        } catch (e) {
          list = [];
        }
      }
    }

    if (!list || list.length === 0) {
      console.warn('MenuAccessService: Menu list is empty!');
      this.activePermissionSet(false, false);
      return;
    }

    const flatList = this.getAllMenusRecursive(list);
    let cleanUrl = currentUrl.split('?')[0].split('#')[0].toLowerCase().trim();
    if (!cleanUrl.startsWith('/')) {
      cleanUrl = '/' + cleanUrl;
    }

    const matchedMenu = flatList.find((item) => {
      if (!item || !item.menuLink || item.menuLink === '-') return false;

      let itemLink = item.menuLink.toLowerCase().trim();
      if (!itemLink.startsWith('/')) {
        itemLink = '/' + itemLink;
      }

      const isExactMatch = cleanUrl === itemLink;
      const isParentRouteMatch = cleanUrl.startsWith(itemLink + '/');
      const isChildRouteMatch = itemLink.startsWith(cleanUrl) && cleanUrl !== '/main';

      return isExactMatch || isParentRouteMatch || isChildRouteMatch;
    });

    if (matchedMenu) {
      const hasFullAccess = this.parseBooleanValue(matchedMenu.fullAccess);
      const hasCanRead = this.parseBooleanValue(matchedMenu.canRead);

      this.activePermissionSet(hasFullAccess, hasCanRead);
    } else {
      console.warn('No menu match found for URL:', cleanUrl);
      this.activePermissionSet(false, false);
    }
  }

  private getAllMenusRecursive(items: any[]): MenuItem[] {
    let menus: MenuItem[] = [];
    if (!Array.isArray(items)) return menus;

    items.forEach((item) => {
      if (item && item.menuLink) {
        menus.push(item);
      }

      const children =
        item.submodules || item.menus || item.modules || item.groups || item.children;
      if (Array.isArray(children) && children.length > 0) {
        menus = menus.concat(this.getAllMenusRecursive(children));
      }
    });

    return menus;
  }

  private parseBooleanValue(val: any): boolean {
    if (val === null || val === undefined) return false;
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return val === 1;

    const strVal = String(val).trim().toUpperCase();
    return strVal === '1' || strVal === 'Y' || strVal === 'TRUE' || strVal === 'YES';
  }

  private activePermissionSet(fullAccess: boolean, canRead: boolean = false) {
    this.currentPermission.set({ fullAccess, canRead });
  }
}
