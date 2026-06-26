import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { ColumnDef, DataGrid } from '../../../shared/data-grid/data-grid';
import { UserMgtService } from '../user-mgt-service';
import { AlertService } from '../../../services/alertService/alert';

@Component({
  selector: 'app-user-mgmt-list',
  standalone: true,
  templateUrl: './user-mgt-list.html',
  styleUrls: ['./user-mgt-list.scss'],
  imports: [CommonModule, FormsModule, DataGrid],
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
  tableHeaders: ColumnDef[] = [
    {
      label: 'No',
      field: 'no',
      width: '100px',
    },
    {
      label: 'User ID',
      field: 'userId',
      width: '100px',
    },
    {
      label: 'User Name',
      field: 'userName',
      width: '140px',
    },
    {
      label: 'Full Name',
      field: 'fullName',
      width: '180px',
    },
    {
      label: 'Email',
      field: 'email',
      width: '250px',
    },
    {
      label: 'Default Location',
      field: 'defaultLocation',
      width: '250px',
    },
    {
      label: 'Default Office',
      field: 'defaultOffice',
      width: '300px',
    },
    {
      label: 'Valid?',
      field: 'valid',
      width: '100px',
      align: 'center',
    },
    {
      label: 'Created By',
      field: 'createdBy',
      width: '150px',
    },
    {
      label: 'Date Created',
      field: 'dateCreated',
      width: '250px',
    },
    {
      label: 'Modified By',
      field: 'modifiedBy',
      width: '140px',
    },
    {
      label: 'Date Modified',
      field: 'dateModified',
      width: '250px',
    },
    // {
    //   label: 'Location & Group (Preview)',
    //   field: 'locationGroupPreview',
    //   width: '220px',
    // },
  ];
  constructor(
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private rowData: UserMgtService,
    private alert: AlertService,
  ) {}

  ngOnInit(): void {
    this.loadUserLedger();
    console.log('paginatedRecords', this.paginatedRecords);
  }

  ngDoCheck(): void {}

  loadUserLedger(): void {
    this.apiService
      .post(`?q=/UserManagements/users/${this.currentPage}/${this.pageSize}/ASC/user_id`, {})
      .pipe(
        finalize(() => {
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

          // console.log('paginatedRecords', this.paginatedRecords);
        },
        error: (err) => {
          console.error(err);
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
    const searchValue = this.searchText?.trim() || '*';
    const endpoint = `?q=/UserManagements/users/${this.currentPage}/${this.pageSize}/ASC/user_id`;

    this.apiService
      .post(endpoint, { search: searchValue })
      .pipe(
        finalize(() => {
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
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredRecords.length / this.pageSize);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePaginationView();
  }

  changePage(page: number): void {
    if (!this.searchText && page >= 1) {
      this.currentPage = page;
      this.loadUserLedger();
    } else {
      this.currentPage = page;
      this.searchUsers();
    }
  }

  updatePaginationView(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedRecords = this.filteredRecords.slice(startIndex, endIndex);
  }

  toggleValidity(rowData: any): void {
    console.log('rowData', rowData);
    if (!rowData) {
      this.alert.showAlert('Error', 'Please select a user to enable/disable', 'error');
      return;
    }

    const payload = {
      isValid: rowData.isValid === 'Y' ? 'N' : 'Y',
      username: rowData.userName,
    };

    this.apiService
      .put(`?q=/UserManagements/users/${rowData.userId}/status`, payload)
      .pipe(
        finalize(() => {
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.userLedgerData = res.content || [];
          this.filteredRecords = [...this.userLedgerData];
          this.paginatedRecords = [...this.userLedgerData];
          this.totalPages = res.totalPages;
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  filterAll(): void {
    console.log('Showing all logs array dataset');
  }

  downloadExcel(): void {
    const search = this.searchText?.trim();

    let url = '?q=/UserManagements/users/export';

    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    this.apiService
      .get(url, {
        responseType: 'arraybuffer',
      })
      .subscribe({
        next: (data: ArrayBuffer) => {
          const blob = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });

          const downloadUrl = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = 'User_Management_List.xlsx';
          a.click();

          window.URL.revokeObjectURL(downloadUrl);
        },
        error: (err) => console.error(err),
      });
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

  // openEditModal(user: any): void {
  //   console.log('Opening edit modal for user:', user);
  //   this.router.navigate(['/home/user-mgt-details'], { state: { userRecord: user } });
  // }

  editUser(row: any) {
    this.router.navigate(['/home/user-mgt-details'], { state: { userRecord: row } });
  }

  // deleteUser(id: number) {
  //   console.log('Deleting user ID:', id);
  // }

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
