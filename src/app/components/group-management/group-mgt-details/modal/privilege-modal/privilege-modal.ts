import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColumnDef, DataGrid } from '../../../../../shared/data-grid/data-grid';
import { ApiService } from '../../../../../services/api.service';

@Component({
  selector: 'app-privilege-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DataGrid],
  templateUrl: './privilege-modal.html',
  styleUrl: './privilege-modal.scss',
})
export class PrivilegeModal implements OnInit {
  @Input() selectedMenuIds: string[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() selectedMenus = new EventEmitter<any[]>();

  constructor(private apiService: ApiService) {}

  selected: any[] = [];

  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  gridData: any[] = [];

  gridColumns: ColumnDef[] = [
    { label: 'Menu Name', field: 'menuName' },
    { label: 'Menu Link', field: 'menuLink' },
  ];

  ngOnInit(): void {
    this.loadMenus();
  }

  loadMenus(search: string = ''): void {
    const url = `?q=/GroupManagements/findMasterMenus/${search || '*'}/*/${this.currentPage}/${this.pageSize}`;

    this.apiService.get(url).subscribe({
      next: (res: any) => {
        this.totalPages = res.totalPages;

        this.gridData = (res.content || []).map((menu: any) => ({
          ...menu,
          isSelected: this.selectedMenuIds.includes(menu.menuId),
        }));

        this.selected = this.gridData.filter((x) => x.isSelected);
      },
      error: (err) => console.log(err),
    });
  }

  onGridSelectionChange(data: any[]): void {
    this.selected = data;

    // update checkbox state in current page
    this.gridData.forEach((row) => {
      row.isSelected = this.selected.some((x) => x.menuId === row.menuId);
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadMenus();
  }

  save(): void {
    this.selectedMenus.emit(this.selected);
  }
}
