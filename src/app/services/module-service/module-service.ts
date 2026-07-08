import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  private modalState = new BehaviorSubject<boolean>(false);
  modalState$ = this.modalState.asObservable();

  private appMenus: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'fa-solid fa-chart-line',
      link: '/home/dashboard',
      hasSubmenu: false,
    },

    {
      title: 'Receipts',
      icon: 'fa-solid fa-receipt',
      hasSubmenu: true,
      isExpanded: false,
      submodules: [
        { title: 'Glossys & Docsys', link: '/home/receipts' },
        { title: 'Undo Receipt', link: '/home/undo-receipt' },
        { title: 'Remove Invoice', link: '/home/receipt-remove' },
        { title: 'Update Cheque', link: '/home/update-cheque' },
        { title: 'Update TT Ref', link: '/home/update-ttref' },
      ],
    },
    // {
    //   title: 'Cheque',
    //   icon: 'fa-solid fa-money-check-dollar',
    //   hasSubmenu: true,
    //   isExpanded: false,
    //   submodules: [
    //     { title: 'Cheque', link: '/home/receipt-cheque' },
    //     { title: 'Remove Cheque', link: '/home/remove-cheque' },
    //     { title: 'Update Cheque', link: '/home/update-cheque' },
    //   ],
    // },
  ];
  getModalState(): boolean {
    return this.modalState.getValue();
  }
  setModalState(isOpen: boolean) {
    this.modalState.next(isOpen);
  }
  getMenus(): MenuItem[] {
    return this.appMenus;
  }
}
