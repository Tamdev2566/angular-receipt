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
    // {
    //   title: 'Dashboard',
    //   icon: 'fa-solid fa-chart-line',
    //   link: '/home/dashboard',
    //   hasSubmenu: false,
    // },

    {
      title: 'Receipts',
      icon: 'fa-solid fa-receipt',
      hasSubmenu: true,
      isExpanded: false,
      submodules: [
        { title: 'Glossys & Docsys', link: '/home/receipts' },
        { title: 'Undo Payments', link: '/home/undo-payment' },
        { title: 'Remove Invoice', link: '/home/remove-invoice' },
        { title: 'Update Cheque', link: '/home/update-cheque' },
        { title: 'Update TT Ref', link: '/home/update-tt-ref' },
      ],
    },
    {
      title: 'Cheque Reader',
      icon: 'fa-solid fa-file-lines',
      hasSubmenu: true,
      isExpanded: false,
      submodules: [
        { title: 'Cheque Reader Information', link: '/home/cheque-reader-info' },
        { title: 'Undo', link: '/home/undo-cheque' },
      ],
    },
    // {
    //   title: 'EDI to CODA',
    //   icon: 'fa-solid fa-file-invoice-dollar',
    //   hasSubmenu: true,
    //   isExpanded: false,
    //   submodules: [{ title: 'EDI to CODA', link: '/home/edi-to-coda' }],
    // },
    // {
    //   title: 'Reports',
    //   icon: 'fa-solid fa-file-lines',
    //   hasSubmenu: true,
    //   isExpanded: false,
    //   submodules: [
    //     { title: 'Print Reports', link: '/home/print-report' },
    //     { title: 'Updated Cheque No Report', link: '/home/updated-cheque-report' },
    //     { title: 'Removed Invoice Report', link: '/home/removed-invoice-report' },
    //     { title: 'Updated TT Ref Report', link: '/home/updated-tt-ref-report' },
    //   ],
    // },

    // {
    //   title: 'Cheque Reader Report',
    //   icon: 'fa-solid fa-file-lines',
    //   hasSubmenu: true,
    //   isExpanded: false,
    //   submodules: [
    //     { title: 'Aging Report', link: '/home/aging-report' },
    //     { title: 'Daily Scan Report', link: '/home/daily-scan-report' },
    //     { title: 'Undo ChequeNo Report', link: '/home/undo-cheque-reader-report' },
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
