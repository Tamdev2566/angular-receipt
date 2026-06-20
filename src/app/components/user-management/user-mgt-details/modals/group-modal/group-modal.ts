import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AlertService } from '../../../../../services/alertService/alert';
import { UserMgtService } from '../../../user-mgt-service';

@Component({
  selector: 'app-group-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-modal.html',
  styleUrls: ['../shared-modal.scss'],
})
export class GroupModal implements OnInit {
  @Input() selectedGroups: any[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any[]>();

  constructor(
    private alertMessage: AlertService,
    private cdr: ChangeDetectorRef,
    private userService: UserMgtService,
  ) {}

  groupSearch = '';

  currentPage = 1;
  pageSize = 10;

  totalRecords = 0;
  totalPages = 0;

  groups: any[] = [];
  filteredGroups: any[] = [];
  tempSelectedGroups: any[] = [];

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.tempSelectedGroups = this.selectedGroups.map((x) => ({ ...x }));

    this.loadGroups('*', 1);

    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe((term) => {
      this.loadGroups(term, 1);
    });
  }

  loadGroups(searchTerm: string = '*', page: number = 1): void {
    this.currentPage = page;

    this.userService.getGroups(searchTerm, page, this.pageSize).subscribe({
      next: (response: any) => {
        this.groups = response?.content || [];

        this.groups.forEach((group: any) => {
          group.selected = this.tempSelectedGroups.some(
            (selected: any) => selected.groupId === group.groupId,
          );
        });

        this.filteredGroups = [...this.groups];

        this.totalPages = response?.totalPages || 0;
        this.totalRecords = response?.totalElements || 0;

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);

        this.alertMessage.showAlert('Failed to load groups', '', 'error');
      },
    });
  }

  filterGroups(): void {
    if (!this.groupSearch?.trim()) {
      this.loadGroups('*', 1);
      return;
    }

    this.searchSubject.next(this.groupSearch);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadGroups(this.groupSearch || '*', this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadGroups(this.groupSearch || '*', this.currentPage - 1);
    }
  }

  onGroupSelectionChange(group: any): void {
    if (group.selected) {
      const exists = this.tempSelectedGroups.some((x) => x.groupId === group.groupId);

      if (!exists) {
        this.tempSelectedGroups.push({ ...group });
      }
    } else {
      this.tempSelectedGroups = this.tempSelectedGroups.filter((x) => x.groupId !== group.groupId);
    }
  }

  saveGroups(): void {
    if (!this.tempSelectedGroups.length) {
      this.alertMessage.showAlert('Error', 'Please select at least one group', 'error');
      return;
    }

    this.save.emit(this.tempSelectedGroups);
    this.close.emit();
  }

  closeModal(): void {
    this.close.emit();
  }
}
