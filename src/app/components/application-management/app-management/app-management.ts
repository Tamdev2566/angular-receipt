import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alertService/alert';
import { ApiService } from '../../../services/api.service';
import { UserService } from '../../../services/userService/user.service';
import { ColumnDef, DataGrid } from '../../../shared/data-grid/data-grid';
import { IconButton } from '../../../shared/icon-button/icon-button';

interface Application {
  app_id: string;
  app_name: string;
  is_valid: string;
  user_created: string;
  date_created: string;
  user_modified: string;
  date_modified: string;
}

interface ApiResponse {
  content: Application[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Component({
  selector: 'app-app-management',
  imports: [CommonModule, FormsModule, IconButton, DataGrid],
  templateUrl: './app-management.html',
  styleUrl: './app-management.scss',
})
export class AppManagement implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private alert = inject(AlertService);
  private user = inject(UserService);

  validFilterMode: 'ALL' | 'INACTIVE' | 'ACTIVE' = 'ALL';
  searchQuery: string = '';
  isValidFilter: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  sortDirection: string = 'ASC';
  sortColumn: string = 'app_name';

  gridData: Application[] = [];
  totalPages: number = 1;
  totalElements: number = 0;

  isEditMode: boolean = false;
  currentUsername: string = 'admin';

  selectedApplications: Application[] = [];
  selectedGroupId: string = '';

  gridColumns: ColumnDef[] = [
    { label: 'App Id', field: 'app_id', align: 'center' },
    { label: 'App Name', field: 'app_name' },
    { label: 'Created By', field: 'user_created', align: 'center' },
    { label: 'Date Created', field: 'date_created', align: 'center' },
    { label: 'Modified By', field: 'user_modified', align: 'center' },
    {
      label: 'Date Modified',
      field: 'date_modified',
      align: 'center',
    },
    { label: 'Valid', field: 'is_valid', align: 'center' },
  ];

  appForm = { appId: '', appName: '' };

  ngOnInit(): void {
    this.currentUsername = this.user.getUser().name;
    this.loadApplications();
  }

  loadApplications(): void {
    let searchText = '';

    if (this.searchQuery && this.searchQuery.trim() && this.searchQuery.trim() !== '%') {
      searchText = encodeURIComponent(this.searchQuery.trim());
    }
    let isValid;
    switch (this.validFilterMode) {
      case 'ACTIVE':
        isValid = 'Y';
        break;
      case 'INACTIVE':
        isValid = 'N';
        break;
      default:
        isValid = '';
    }
    const endpoint = `applications/${this.currentPage}/${this.pageSize}/${this.sortDirection}/${this.sortColumn}`;

    const data = {
      search: searchText,
      isValid: isValid,
    };

    this.apiService.post(endpoint, data, true).subscribe({
      next: (res: any) => {
        this.gridData = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
      },
      error: (err) => console.error(err),
    });
  }

  get validButtonText(): string {
    if (this.validFilterMode === 'INACTIVE') return 'InActive';
    if (this.validFilterMode === 'ACTIVE') return 'Active';
    return 'All';
  }

  get validButtonIcon(): string {
    if (this.validFilterMode === 'INACTIVE') return 'fa-xmark';
    if (this.validFilterMode === 'ACTIVE') return 'fa-check';
    return 'fa-check-double';
  }

  onToggleValidClick(): void {
    if (this.validFilterMode === 'ALL') this.validFilterMode = 'INACTIVE';
    else if (this.validFilterMode === 'INACTIVE') this.validFilterMode = 'ACTIVE';
    else this.validFilterMode = 'ALL';

    this.loadApplications();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadApplications();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadApplications();
    }
  }

  onHistory(): void {
    this.router.navigate(['home/app-history']);
  }

  onPageChange(newPage: number): void {
    this.loadApplications();
  }

  onGridSelectionChange(rows: Application[]): void {
    this.selectedApplications = rows;
  }

  bulkAssign(): void {
    if (!this.selectedGroupId) {
      alert('Please select a Group');
      return;
    }

    if (this.selectedApplications.length === 0) {
      alert('Please select Applications');
      return;
    }

    const body = {
      appIds: this.selectedApplications.map((x) => x.app_id),
      username: this.currentUsername,
    };

    this.apiService
      .post(`groups/${this.selectedGroupId}/applications/bulk-assign`, body, true)
      .subscribe({
        next: (res) => {
          alert(`${res} Application(s) Assigned Successfully`);

          this.loadApplications();
        },
        error: (err) => {
          console.error(err);
          alert('Bulk Assign Failed');
        },
      });
  }
  bulkRemove(): void {
    if (!this.selectedGroupId) {
      alert('Please select a Group');
      return;
    }

    if (this.selectedApplications.length === 0) {
      alert('Please select Applications');
      return;
    }

    const body = {
      appIds: this.selectedApplications.map((x) => x.app_id),
      username: this.currentUsername,
    };

    this.apiService
      .post(`groups/${this.selectedGroupId}/applications/bulk-remove`, body, true)
      .subscribe({
        next: (res) => {
          alert(`${res} Application(s) Removed Successfully`);

          this.loadApplications();
        },
        error: (err) => {
          console.error(err);
          alert('Bulk Remove Failed');
        },
      });
  }
  viewDetails(row: Application): void {
    this.apiService.get(`applications/${row.app_id}`, {}, true).subscribe({
      next: (response: any) => {
        this.isEditMode = true;

        this.appForm = {
          appId: response.app_id,
          appName: response.app_name,
        };
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  saveApplication(): void {
    if (!this.appForm.appId.trim() || !this.appForm.appName.trim()) {
      alert('Application ID and Application Name are required');
      return;
    }

    if (this.isEditMode) {
      const body = {
        appName: this.appForm.appName.trim(),
        username: this.currentUsername,
      };

      this.apiService.put(`applications/${this.appForm.appId}`, body, true).subscribe({
        next: (res) => {
          this.appForm = {
            appId: '',
            appName: '',
          };
          this.alert.showAlert('Success', 'Application Updated Successfully', 'success');
          this.isEditMode = false;

          this.loadApplications();
        },
        error: (err) => {
          console.error(err);
          this.alert.showAlert('Error', err?.error?.message, 'error');
        },
      });
    } else {
      const body = {
        appId: this.appForm.appId.trim(),
        appName: this.appForm.appName.trim(),
        username: this.currentUsername,
      };

      this.apiService.post('applications', body, true).subscribe({
        next: (res: any) => {
          this.alert.showAlert('Success', 'Application Created Successfully', 'success');
          this.appForm = {
            appId: '',
            appName: '',
          };

          this.isEditMode = false;
          this.loadApplications();
        },
        error: (err: any) => {
          this.alert.showAlert('Error', err?.error?.message, 'error');
        },
      });
    }
  }

  toggleStatus(app: Application): void {
    const nextStatus = app.is_valid === 'Y' ? 'N' : 'Y';
    const endpoint = `applications/${app.app_id}/status`;
    const body = { isValid: nextStatus, username: this.currentUsername };

    this.apiService.patch(endpoint, body, true).subscribe({
      next: () => this.loadApplications(),
    });
  }

  deleteApplication(appId: string): void {
    if (confirm('Are you sure you want to delete this application?')) {
      const endpoint = `applications/${appId}`;
      this.apiService.delete(endpoint, true).subscribe({
        next: () => {
          this.currentPage = 1;
          this.loadApplications();
        },
      });
    }
  }
}
