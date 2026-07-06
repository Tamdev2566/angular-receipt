import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-summary-card',
  imports: [CommonModule],
  templateUrl: './summary-card.html',
  styleUrl: './summary-card.scss',
})
export class SummaryCard {
  @Input() items: any[] = [];

  @Output() undo = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>();

  currentPage = signal(1);
  pageSize = 8;

  get pagedItems() {
    const start = (this.currentPage() - 1) * this.pageSize;

    return this.items.slice(start, start + this.pageSize);
  }

  get startIndex(): number {
    return this.items.length ? (this.currentPage() - 1) * this.pageSize + 1 : 0;
  }

  get endIndex(): number {
    return Math.min(this.currentPage() * this.pageSize, this.items.length);
  }

  get totalPages(): number {
    return Math.ceil(this.items.length / this.pageSize) || 1;
  }

  get pages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage.set(page);

      // if (this.isServerSide()) {
      //   this.pageChange.emit(page);
      // }
    }
  }
}
