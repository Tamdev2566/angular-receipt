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

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  
  private appMenus: MenuItem[] = [
    {
      title: 'Receipts',
      icon: 'fa-solid fa-receipt',
      hasSubmenu: true,
      isExpanded: false,
      submodules: [
        { title: 'Glossys & Docsys', link: '/home/receipt-glossys' },
        { title: 'Undo Receipt', link: '/home/undo-receipt' },
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
     {
      title: 'Administrative',
      icon: 'fa-solid fa-user',
      hasSubmenu: true,
      isExpanded: false,
      submodules: [
        { title: 'User Creation', link: '/home/user' },
        // { title: 'Remove Cheque', link: '/home/remove-cheque' },
        // { title: 'Update Cheque', link: '/home/update-cheque' },
      ],
    },
  ];

  getMenus(): MenuItem[] {
    return this.appMenus;
  }
}