import { Injectable } from '@angular/core';

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
}

@Injectable({ providedIn: 'root' })
export class ModuleService {
  private appMenus: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'fa-solid fa-chart-line',
      link: '/home/dashboard',
      hasSubmenu: false,
    },
    {
      title: 'Application Management',
      icon: 'fa-solid fa-chart-line',
      link: '/home/app-management',
      hasSubmenu: false,
    },
    {
      title: 'Administrative',
      icon: 'fa-solid fa-user',
      hasSubmenu: true,
      isExpanded: false,
      submodules: [
        { title: 'User Creation', link: '/home/user-mgt-list' },
        { title: 'Group Management', link: '/home/group-mgt-list' },
      ],
    },
    {
      title: 'Receipts',
      icon: 'fa-solid fa-receipt',
      hasSubmenu: true,
      isExpanded: false,
      submodules: [
        { title: 'Glossys & Docsys', link: '/home/receipts' },
        { title: 'Undo Receipt', link: '/home/receipt-undo' },
        { title: 'Remove Receipt', link: '/home/remove-receipt' },
        { title: 'Update Cheque', link: '/home/update-cheque' },
        { title: 'Update TT Ref', link: '/home/update-ttref' },
      ],
    },
    {
      title: 'Cheque',
      icon: 'fa-solid fa-money-check-dollar',
      hasSubmenu: true,
      isExpanded: false,
      submodules: [
        { title: 'Cheque', link: '/home/receipt-cheque' },
        { title: 'Remove Cheque', link: '/home/remove-cheque' },
        { title: 'Update Cheque', link: '/home/update-cheque' },
      ],
    },
  ];

  getMenus(): MenuItem[] {
    return this.appMenus;
  }
}
