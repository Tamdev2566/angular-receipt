import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Combobox } from '../../../shared/combobox/combobox';
import { ColumnDef, DataGrid } from '../../../shared/data-grid/data-grid';
import { IconButton } from '../../../shared/icon-button/icon-button';
import { AlertService } from '../../../services/alertService/alert';
import { UserService } from '../../../services/userService/user.service';

interface Application {
  app_id: string;
  app_name: string;
  is_valid: string;
}

@Component({
  selector: 'app-app-group-management',
  standalone: true,
  imports: [CommonModule, FormsModule, DataGrid, IconButton, Combobox],
  templateUrl: './app-group-management.html',
  styleUrl: './app-group-management.scss',
})
export class AppGroupManagement implements OnInit {
  constructor(
    private apiService: ApiService,
    private alert: AlertService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
  ) {}

  currentUsername: any;

  groups: any[] = [];

  selectedGroup: any = null;
  loading = false;

  request = {
    search: '',
  };

  targetPage = 1;
  pageSize = 20;
  sort = 'groupId';

  availableCurrentPage = 1;
  availableTotalPages = 1;
  availablePageSize = 10;

  assignedCurrentPage = 1;
  assignedTotalPages = 1;
  assignedPageSize = 10;

  availableApplications: Application[] = [];
  assignedApplications: Application[] = [];

  selectedAvailableApps: Application[] = [];
  selectedAssignedApps: Application[] = [];

  availableColumns: ColumnDef[] = [
    { label: 'Application Id', field: 'app_id', width: '150px' },
    { label: 'Application Name', field: 'app_name' },
  ];

  assignedColumns: ColumnDef[] = [
    { label: 'Application Id', field: 'app_id', width: '150px' },
    { label: 'Application Name', field: 'app_name' },
  ];

  ngOnInit(): void {
    this.currentUsername = this.userService.getUser();
    this.loadGroups();
    this.loadAvailableApplications();
  }

  loadGroups(): void {
    this.apiService.get('groups/lightweight', {}, true).subscribe({
      next: (response: any) => {
        this.groups = response || [];
      },
      error: (err) => console.error(err),
    });
  }
  ngDoCheck() {
    console.log(this.selectedGroup);
  }

  loadAvailableApplications(): void {
    this.apiService.get('applications/lightweight', {}, true).subscribe({
      next: (response: any) => {
        this.availableApplications = response || [];
        if (this.selectedGroup) {
          this.removeAssignedFromAvailable();
        }
      },
      error: (err) => console.error(err),
    });
  }

  onGroupChange(groupId: any): void {
    this.selectedGroup = groupId;
    this.availableCurrentPage = 1;
    this.assignedCurrentPage = 1;
    this.selectedAvailableApps = [];
    this.selectedAssignedApps = [];

    this.loadAvailableApplications();
    this.loadAssignedApplications();
  }

  loadAssignedApplications(): void {
    if (!this.selectedGroup) return;
    this.loading = true;

    this.apiService.get(`groups/${this.selectedGroup}/applications`, {}, true).subscribe({
      next: (response: any) => {
        this.assignedApplications = response || [];
        this.removeAssignedFromAvailable();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  onAvailablePageChange(page: number): void {
    this.availableCurrentPage = page;
    this.loadAvailableApplications();
  }

  onAssignedPageChange(page: number): void {
    this.assignedCurrentPage = page;
    this.loadAssignedApplications();
  }

  removeAssignedFromAvailable(): void {
    const assignedIds = this.assignedApplications.map((x) => x.app_id);
    this.availableApplications = this.availableApplications.filter(
      (x) => !assignedIds.includes(x.app_id),
    );
  }

  loadApplicationCount(): void {
    this.apiService.get(`groups/${this.selectedGroup}/applications/count`).subscribe({
      next: (count: any) => console.log('Application Count : ', count),
      error: (err) => console.error(err),
    });
  }

  assignApplication(row: Application): void {
    if (!this.selectedGroup) {
      this.alert.showAlert('Error', 'Please select a Group.', 'error');
      return;
    }
    const body = { username: this.currentUsername.name };

    this.apiService
      .post(`groups/${this.selectedGroup}/applications/${row.app_id}`, body, true)
      .subscribe({
        next: () => {
          this.alert.showAlert('Success', 'Application Assigned Successfully', 'success');
          this.loadAvailableApplications();
          this.loadAssignedApplications();
          this.loadApplicationCount();
        },
        error: (err) => console.error(err),
      });
  }

  removeApplication(row: Application): void {
    if (!this.selectedGroup) {
      this.alert.showAlert('Error', 'Please select a Group.', 'error');
      return;
    }
    const body = { username: this.currentUsername.name };

    this.apiService
      .delete(`groups/${this.selectedGroup}/applications/${row.app_id}`, true, body)
      .subscribe({
        next: () => {
          this.alert.showAlert('Success', 'Application Removed Successfully', 'success');
          this.loadAvailableApplications();
          this.loadAssignedApplications();
          this.loadApplicationCount();
        },
        error: (err) => console.error(err),
      });
  }

  bulkAssign(): void {
    if (!this.selectedGroup) {
      this.alert.showAlert('Error', 'Please select a Group.', 'error');
      return;
    }
    if (this.selectedAvailableApps.length === 0) {
      this.alert.showAlert('Error', 'Please select  Applications.', 'error');
      return;
    }

    const body = {
      appIds: this.selectedAvailableApps.map((x) => x.app_id),
      username: this.currentUsername.name,
    };

    this.apiService
      .post(`groups/${this.selectedGroup}/applications/bulk-assign`, body, true)
      .subscribe({
        next: () => {
          this.alert.showAlert('Success', 'Application Assigned Successfully', 'success');
          this.selectedAvailableApps = [];
          this.loadAvailableApplications();
          this.loadAssignedApplications();
          this.loadApplicationCount();
        },
        error: (err) => console.error(err),
      });
  }

  bulkRemove(): void {
    if (!this.selectedGroup) {
      this.alert.showAlert('Error', 'Please select a Group.', 'error');
      return;
    }
    if (this.selectedAssignedApps.length === 0) {
      this.alert.showAlert('Error', 'Please select Applications', 'error');
      return;
    }

    const body = {
      appIds: this.selectedAssignedApps.map((x) => x.app_id),
      username: this.currentUsername.name,
    };

    this.apiService
      .post(`groups/${this.selectedGroup}/applications/bulk-remove`, body, true)
      .subscribe({
        next: () => {
          this.alert.showAlert('Success', 'Applications Removed Successfully', 'success');
          this.selectedAssignedApps = [];
          this.loadAvailableApplications();
          this.loadAssignedApplications();
          this.loadApplicationCount();
        },
        error: (err) => console.error(err),
      });
  }
}
