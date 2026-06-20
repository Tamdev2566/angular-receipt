import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, output, signal, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface ColumnDef {
  label: string;
  field: string;
  width?: string;
  align?: 'start' | 'center' | 'end';
  type?: 'text' | 'badge';
}

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, NgTemplateOutlet],
  templateUrl: './data-grid.html',
  styleUrl: './data-grid.scss',
})
export class DataGrid {
  records = input<any[]>([]);
  columns = input<ColumnDef[]>([]);

  showCheckbox = input<boolean>(false);
  showAction = input<boolean>(false);
  actionTemplate = input<TemplateRef<any> | null>(null);

  pageSize = input<number>(10);
  isServerSide = input<boolean>(false);
  serverTotalPages = input<number>(1);
  serverCurrentPage = input<number>(1);
  tableHeight = input<string>('auto');

  selectionChange = output<any[]>();
  pageChange = output<number>();

  currentPage = signal(1);

  totalPages = computed(() => {
    if (this.isServerSide()) {
      return this.serverTotalPages();
    }
    return Math.ceil(this.records().length / this.pageSize());
  });

  pageNumbers = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  });

  pagedRecords = computed(() => {
    if (this.isServerSide()) {
      return this.records();
    }

    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.records().slice(start, end);
  });

  totalColSpan = computed(() => {
    let count = this.columns().length;
    if (this.showCheckbox()) count++;
    if (this.showAction()) count++;
    return count;
  });

  isAllSelected(): boolean {
    const recordsToEvaluate = this.pagedRecords();
    return recordsToEvaluate.length > 0 && recordsToEvaluate.every((x) => x.isSelected);
  }

  toggleAllRows(event: any): void {
    const checked = event.target.checked;
    this.pagedRecords().forEach((x) => (x.isSelected = checked));
    this.emitSelection();
  }

  onRowSelect(): void {
    this.emitSelection();
  }

  private emitSelection(): void {
    this.selectionChange.emit(this.records().filter((x) => x.isSelected));
  }

  changePage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);

      if (this.isServerSide()) {
        this.pageChange.emit(page);
      }
    }
  }

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }

    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }

    return [1, '...', current - 1, current, current + 1, '...', total];
  });
}
