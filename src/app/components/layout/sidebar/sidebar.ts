import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { MenuItem, ModuleService } from '../../../services/module-service/module-service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
  imports: [RouterLink, RouterLinkActive, CommonModule],
})
export class Sidebar implements OnInit, OnDestroy {
  private modulesService = inject(ModuleService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  appMenus: MenuItem[] = [];
  private menuSubscription?: Subscription;

  ngOnInit(): void {
    this.menuSubscription = this.modulesService.menuList$.subscribe({
      next: (menus: MenuItem[]) => {
        if (menus) {
          this.appMenus = menus.filter(
            (item) => item.link !== '/main/welcome' && item.title?.toLowerCase() !== 'home',
          );
        } else {
          this.appMenus = [];
        }

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error receiving menu stream in sidebar', err),
    });
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

  ngOnDestroy(): void {
    if (this.menuSubscription) {
      this.menuSubscription.unsubscribe();
    }
  }
}
