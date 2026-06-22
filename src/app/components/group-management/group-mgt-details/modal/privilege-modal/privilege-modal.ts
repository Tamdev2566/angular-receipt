import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColumnDef, DataGrid } from '../../../../../shared/data-grid/data-grid';

@Component({
  selector: 'app-privilege-modal',
  imports: [CommonModule, FormsModule, DataGrid],
  templateUrl: './privilege-modal.html',
  styleUrl: './privilege-modal.scss',
})
export class PrivilegeModal {
  @Input() menus: any[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() selectedMenus = new EventEmitter<any[]>();

  selected: any[] = [];
  currentPage = 1;
  totalPages = 1;
  pageSize = 20;

  gridColumns: ColumnDef[] = [
    { label: 'Menu Name', field: 'menuLink' },
    { label: 'Menu Link', field: 'menuName' },
  ];

  gridData: any[] = [];
  ngOnInit() {
    console.log(this.menus);
    this.gridData = this.menus;
  }
  toggleMenu(menu: any, checked: boolean) {
    if (checked) {
      this.selected.push(menu);
    } else {
      this.selected = this.selected.filter((x) => x.menuId !== menu.menuId);
    }
  }

  save() {
    this.selectedMenus.emit(this.selected);
  }
  onGridSelectionChange(data: any) {}
  onPageChange(data: any) {}
}
