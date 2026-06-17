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
  imports: [CommonModule, FormsModule, NgTemplateOutlet], // NgTemplateOutlet is required
  templateUrl: './data-grid.html',
  styleUrl: './data-grid.scss',
})
export class DataGrid {
  records = input<any[]>([]);
  columns = input<ColumnDef[]>([]);

  showCheckbox = input<boolean>(false);
  showAction = input<boolean>(false);

  // New Input: Receive custom template from parent
  actionTemplate = input<TemplateRef<any> | null>(null);

  selectionChange = output<any[]>();

  pageSize = 10;
  currentPage = signal(1);

  totalPages = computed(() => Math.ceil(this.records().length / this.pageSize));

  pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  pagedRecords = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.records().slice(start, end);
  });

  totalColSpan = computed(() => {
    let count = this.columns().length;
    if (this.showCheckbox()) count++;
    if (this.showAction()) count++;
    return count;
  });

  isAllSelected(): boolean {
    return this.pagedRecords().length > 0 && this.pagedRecords().every((x) => x.isSelected);
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

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
}
