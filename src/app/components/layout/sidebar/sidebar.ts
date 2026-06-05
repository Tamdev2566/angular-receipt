import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { MenuItem, ModuleService } from '../../../services/module-service/module-service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
  imports: [RouterLink, RouterLinkActive, NgFor, NgIf],
})
export class Sidebar implements OnInit {
  private modulesService = inject(ModuleService);
  
  appMenus: MenuItem[] = [];

  ngOnInit(): void {
    this.appMenus = this.modulesService.getMenus();

    console.log('appMenus',this.appMenus);
    
  }

  toggleSubmenu(menu: MenuItem): void {
    if (menu.hasSubmenu) {
      menu.isExpanded = !menu.isExpanded;
    }
  }

  trackBySubmoduleId(index: number, sub: any): string {
    return sub.id || sub.title; 
  }
}