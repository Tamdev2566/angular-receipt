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
  fullAccess: number | string;
  canRead: number | string;
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
        list = JSON.parse(stored);
        this.menuList.set(list);
      }
    }

    if (!list || list.length === 0) {
      console.warn('MenuAccessService: Menu list is empty!');
      this.activePermissionSet(false, false);
      return;
    }

    let cleanUrl = currentUrl.split('?')[0].split('#')[0].toLowerCase().trim();
    if (!cleanUrl.startsWith('/')) {
      cleanUrl = '/' + cleanUrl;
    }

    const matchedMenu = list.find((item) => {
      if (!item.menuLink || item.menuLink === '-') return false;

      let itemLink = item.menuLink.toLowerCase().trim();
      if (!itemLink.startsWith('/')) {
        itemLink = '/' + itemLink;
      }

      return cleanUrl === itemLink || cleanUrl.startsWith(itemLink + '/');
    });

    if (matchedMenu) {
      const hasFullAccess = Number(matchedMenu.fullAccess) === 1;
      const hasCanRead = Number(matchedMenu.canRead) === 1;
      this.activePermissionSet(hasFullAccess, hasCanRead);
    } else {
      this.activePermissionSet(false, false);
    }
  }

  private activePermissionSet(fullAccess: boolean, canRead: boolean = false) {
    this.currentPermission.set({ fullAccess, canRead });
  }
}
