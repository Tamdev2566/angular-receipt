import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-grid',
  imports: [CommonModule, FormsModule],
  templateUrl: './data-grid.html',
  styleUrl: './data-grid.scss',
})
export class DataGrid {
  records = input<any[]>([]);
  currentPage = input<number>(1);
  totalPages = input<number>(1);

  pageChange = output<number>();
  selectionChange = output<any[]>();

  pageNumbers = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  });

  // Check if all rows are selected
  isAllSelected(): boolean {
    const data = this.records();
    return data.length > 0 && data.every((records) => records.isSelected);
  }

  // Toggle select all checkbox
  toggleAllRows(event: any) {
    const isChecked = event.target.checked;
    this.records().forEach((records) => (records.isSelected = isChecked));
    this.emitSelection();
  }

  // Handle single row select
  onRowSelect() {
    this.emitSelection();
  }

  // Emit selected rows to parent
  private emitSelection() {
    const selectedRows = this.records().filter((r) => r.isSelected);
    this.selectionChange.emit(selectedRows);
  }

  // Handle page change
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }
}
