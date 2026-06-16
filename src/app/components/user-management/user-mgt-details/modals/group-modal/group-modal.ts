import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-group-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-modal.html',
  styleUrls: ['../shared-modal.scss'],
})
export class GroupModal implements OnInit {
  @Input() groups: any[] = [];

  @Output() close = new EventEmitter<void>();

  @Output() save = new EventEmitter<any[]>();

  groupSearch = '';

  currentPage = 1;

  pageSize = 5;

  filteredGroups: any[] = [];

  ngOnInit(): void {
    this.filteredGroups = [...this.groups];
  }

  get paginatedGroups() {
    const start = (this.currentPage - 1) * this.pageSize;

    return this.filteredGroups.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredGroups.length / this.pageSize) || 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  filterGroups() {
    const search = this.groupSearch.toLowerCase();

    this.filteredGroups = this.groups.filter((x) => x.groupName.toLowerCase().includes(search));

    this.currentPage = 1;
  }

  saveGroups() {
    const selected = this.groups.filter((x) => x.selected);

    this.save.emit(selected);
    this.close.emit();
  }
}
