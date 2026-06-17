import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem, ModuleService } from '../../../services/module-service/module-service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
  imports: [RouterLink, RouterLinkActive, CommonModule],
})
export class Sidebar implements OnInit {
  private modulesService = inject(ModuleService);

  appMenus: MenuItem[] = [];
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.appMenus = this.modulesService.getMenus();

    console.log('appMenus', this.appMenus);
  }

  toggleSubmenu(menu: MenuItem): void {
    if (menu.hasSubmenu) {
      menu.isExpanded = !menu.isExpanded;
    } else if (menu.link) {
      this.router.navigateByUrl(menu.link);
    }
  }

  trackBySubmoduleId(index: number, sub: any): string {
    return sub.id || sub.title;
  }
}
