import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-summary-card',
  imports: [CommonModule],
  templateUrl: './summary-card.html',
  styleUrl: './summary-card.scss',
})
export class SummaryCard implements AfterViewInit, OnDestroy {
  @Input() items: any[] = [];

  @ViewChild('cardGrid') private cardGrid?: ElementRef<HTMLElement>;

  @Output() undo = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>();

  currentPage = signal(1);
  pageSize = 8;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(() => this.updatePageSize());
    this.resizeObserver.observe(this.cardGrid!.nativeElement);
    requestAnimationFrame(() => this.updatePageSize());
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

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

  private updatePageSize(): void {
    const grid = this.cardGrid?.nativeElement;
    if (!grid) return;

    const columnTracks = getComputedStyle(grid).gridTemplateColumns.match(/[\d.]+px/g) ?? [];
    const firstCard = grid.querySelector<HTMLElement>('.summary-card');
    const gap = Number.parseFloat(getComputedStyle(grid).columnGap) || 0;
    const columns =
      columnTracks.length ||
      (firstCard ? Math.round((grid.clientWidth + gap) / (firstCard.offsetWidth + gap)) : 1);
    const nextPageSize = Math.max(columns, 1) * 2;

    if (nextPageSize === this.pageSize) return;

    const firstVisibleItem = (this.currentPage() - 1) * this.pageSize;
    this.pageSize = nextPageSize;
    this.currentPage.set(Math.min(Math.floor(firstVisibleItem / nextPageSize) + 1, this.totalPages));
  }
}
