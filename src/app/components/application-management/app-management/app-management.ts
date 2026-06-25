import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ColumnDef, DataGrid } from '../../../shared/data-grid/data-grid';
import { IconButton } from '../../../shared/icon-button/icon-button';
// Unga service path kku yethaarpole mathikolavum

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

  searchTerm: string = 'admin';
  isValidFilter: string = 'Y';
  currentPage: number = 1;
  pageSize: number = 10;
  sortDirection: string = 'ASC';
  sortColumn: string = 'app_name';

  gridData: Application[] = [];
  totalPages: number = 1;
  totalElements: number = 0;

  isEditMode: boolean = false;
  currentUsername: string = 'admin';

  gridColumns: ColumnDef[] = [
    { label: 'Group ID', field: 'id', align: 'center', width: '120px' },
    { label: 'Profile Name', field: 'name' },
    { label: 'Created By', field: 'createdBy', align: 'center', width: '130px' },
    { label: 'Date Created', field: 'dateCreated', align: 'center', width: '160px' },
    { label: 'Modified By', field: 'modifiedBy', align: 'center', width: '130px' },
    { label: 'Total Users', field: 'totalUsers', align: 'center', type: 'badge', width: '110px' },
    { label: 'Valid', field: 'valid', align: 'center', width: '80px' },
  ];

  appForm = {
    appId: '',
    appName: '',
  };

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    let search = '%';

    if (this.searchTerm && this.searchTerm.trim() && this.searchTerm.trim() !== '%') {
      search = encodeURIComponent(this.searchTerm.trim());
    }

    const endpoint = `applications/${search}/${this.isValidFilter}/${this.currentPage}/${this.pageSize}/${this.sortDirection}/`;

    console.log(endpoint);

    this.apiService.get(endpoint, {}, true).subscribe({
      next: (res: any) => {
        this.gridData = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
      },
      error: (err) => console.error(err),
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadApplications();
  }

  changeSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'ASC';
    }
    this.loadApplications();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadApplications();
    }
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.appForm = { appId: '', appName: '' };
  }

  onPageChange(newPage: number): void {
    this.loadApplications();
  }

  onGridSelectionChange(selectedRows: any[]): void {
    console.log('Selected items count:');
  }

  viewDetails(row: any): void {
    this.router.navigate(['home/group-mgt-details'], {
      state: { row },
    });
  }

  openEditModal(app: Application): void {
    this.isEditMode = true;
    this.appForm = {
      appId: app.app_id,
      appName: app.app_name,
    };
  }

  saveApplication(): void {
    if (this.isEditMode) {
      const endpoint = `applications/${this.appForm.appId}`;
      const body = { appName: this.appForm.appName, username: this.currentUsername };

      this.apiService.put(endpoint, body).subscribe({
        next: () => {
          this.loadApplications();
          this.closeModal('appModal');
        },
      });
    } else {
      const endpoint = `applications`;
      const body = { ...this.appForm, username: this.currentUsername };

      this.apiService.post(endpoint, body).subscribe({
        next: () => {
          this.loadApplications();
          this.closeModal('appModal');
        },
      });
    }
  }

  toggleStatus(app: Application): void {
    const nextStatus = app.is_valid === 'Y' ? 'N' : 'Y';
    const endpoint = `applications/${app.app_id}/status`;
    const body = { isValid: nextStatus, username: this.currentUsername };

    this.apiService.patch(endpoint, body).subscribe({
      next: () => this.loadApplications(),
    });
  }

  deleteApplication(appId: string): void {
    if (confirm('Are you sure you want to delete this application?')) {
      const endpoint = `applications/${appId}`;
      this.apiService.delete(endpoint).subscribe({
        next: () => {
          this.currentPage = 1;
          this.loadApplications();
        },
      });
    }
  }

  private closeModal(modalId: string): void {
    const modalEl = document.getElementById(modalId);
    if (modalEl) {
      const bootstrap = (window as any).bootstrap;
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) modalInstance.hide();
    }
  }
}
