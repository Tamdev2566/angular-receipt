import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

interface SubMenu {
  title: string;
  link: string;
}

interface MenuItem {
  title: string;
  icon?: string;
  link?: string;
  hasSubmenu: boolean;
  isExpanded?: boolean;
  submodules?: SubMenu[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
  imports: [RouterLink, RouterLinkActive, NgFor, NgIf],
})
export class Sidebar {
  appMenus: MenuItem[] = [
    {
      title: 'Receipts',
      icon: 'fa-solid fa-receipt',
      hasSubmenu: true,
      isExpanded: true,
      submodules: [
        { title: 'Glossys & Docsys', link: '/home/receipt-glossys' },
        { title: 'Undo Receipt', link: '/home/undo-receipt' },
        { title: 'Remove Receipt', link: '/home/remove-receipt' },
        { title: 'Update Cheque', link: '/home/update-cheque' },
        { title: 'Update TT Ref', link: '/home/update-ttref' },
      ],
    },
    // {
    //   title: 'CRM',
    //   icon: 'fa-solid fa-users',
    //   hasSubmenu: true,
    //   isExpanded: false,
    //   submodules: [
    //     { title: 'Projects Track', link: '/dashboard/crm/projects' },
    //     { title: 'Contacts Management', link: '/dashboard/crm/contacts' },
    //   ],
    // },
  ];

  toggleSubmenu(menu: MenuItem): void {
    if (menu.hasSubmenu) {
      menu.isExpanded = !menu.isExpanded;
    }
  }

  trackBySubmoduleId(index: number, sub: any): number {
    return sub.id; // Directly targets your unique id column reference key!
  }
}
