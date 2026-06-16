import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataGrid } from '../../../shared/data-grid/data-grid';
import { ApiService } from '../../../services/api.service';
import { LoaderComponent } from '../../../shared/loader/loader';
import { finalize } from 'rxjs';
import { UserMgtService } from '../user-mgt-service';

@Component({
  selector: 'app-user-mgmt-list',
  standalone: true,
  templateUrl: './user-mgt-list.html',
  styleUrls: ['./user-mgt-list.scss'],
  imports: [CommonModule, FormsModule, DataGrid, LoaderComponent],
})
export class UserMgtList implements OnInit {
  toastMessage: string | null = null;

  userLedgerData: any[] = [];
  filteredRecords: any[] = [];
  paginatedRecords: any[] = [];

  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 20;
  pageNumbers: number[] = [];
  selectedRecord: any = null;
  searchText = '';
  isGlobalLoading: boolean = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private rowData: UserMgtService,
  ) {}

  ngOnInit(): void {
    this.loadUserLedger();
  }

  ngDoCheck(): void {
    console.log(this.rowData.userListRowData);
  }

  loadUserLedger(): void {
    this.isGlobalLoading = true;
    this.apiService
      .post(`?q=/UserManagements/users/${this.currentPage}/${this.pageSize}/ASC/user_id`, {})
      .pipe(
        finalize(() => {
          this.isGlobalLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.userLedgerData = (res.content || []).map((item: any, index: number) => ({
            no: (this.currentPage - 1) * this.pageSize + index + 1,

            userId: item.userId,
            userName: item.userName,
            fullName: item.fullName,
            email: item.email,

            defaultOffice: item.officeName,
            defaultLocation: item.locationName,

            valid: item.isValid,

            createdBy: item.userCreated,
            modifiedBy: item.userModified,

            dateCreated: item.dateCreated,
            dateModified: item.dateModified,

            isSelected: false,
          }));

          this.filteredRecords = [...this.userLedgerData];

          this.paginatedRecords = [...this.userLedgerData];

          this.totalPages = res.totalPages;

          this.isGlobalLoading = false;

          console.log('paginatedRecords', this.paginatedRecords);
        },
        error: (err) => {
          console.error(err);
          this.isGlobalLoading = false;
        },
      });
  }

  onKeyPress(event: KeyboardEvent): void {
    const enterKey = event?.key;
    if (enterKey === 'Enter') {
      this.searchUsers();
    }
  }

  searchUsers(): void {
    this.isGlobalLoading = true;
    const searchValue = this.searchText?.trim() || '*';
    const endpoint = `?q=/UserManagements/users/${this.currentPage}/${this.pageSize}/ASC/user_id`;

    this.apiService
      .post(endpoint, { search: searchValue })
      .pipe(
        finalize(() => {
          this.isGlobalLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.userLedgerData = res.content || [];
          this.filteredRecords = [...this.userLedgerData];
          this.paginatedRecords = [...this.userLedgerData];
          this.totalPages = res.totalPages;
          this.isGlobalLoading = false;
        },

        error: (err) => {
          console.error(err);
          this.isGlobalLoading = false;
        },
      });
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredRecords.length / this.pageSize);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePaginationView();
  }

  changePage(page: number): void {
    if (page >= 1) {
      this.currentPage = page;
      this.loadUserLedger();
    }
  }

  updatePaginationView(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedRecords = this.filteredRecords.slice(startIndex, endIndex);
  }

  toggleValidity(): void {
    console.log('Valid/Invalid toggled for records');
  }

  filterAll(): void {
    console.log('Showing all logs array dataset');
  }

  printLedger(): void {
    window.print();
  }

  viewHistory(): void {
    console.log('Opening auditing history component context');
    this.router.navigate(['/home/user-mgt-history']);
  }

  onSearch(event: any): void {
    this.searchText = event.target.value;
  }

  onCreateNewUser(): void {
    this.rowData.setRowData([]);
    this.router.navigate(['/home/user-mgt-details']);
  }

  openEditModal(user: any): void {
    console.log('Opening edit modal for user:', user);
    this.router.navigate(['/home/user-mgt-details']);
  }

  isAllSelected(): boolean {
    if (!this.paginatedRecords.length) return false;
    return this.paginatedRecords.every((row) => row.isSelected);
  }

  toggleAllRows(event: any): void {
    const checked = event.target.checked;
    this.paginatedRecords.forEach((row) => (row.isSelected = checked));
    this.trackSelectionLogs();
  }

  onRowSelect(record: any): void {
    this.trackSelectionLogs();
    console.log('record', record);
    this.rowData.setRowData(record);
  }

  trackSelectionLogs(): void {
    const selectedRows = this.paginatedRecords.filter((row) => row.isSelected);

    this.selectedRecord = selectedRows.length === 1 ? selectedRows[0] : null;
  }
}
