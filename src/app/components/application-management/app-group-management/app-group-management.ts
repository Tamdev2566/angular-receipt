import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ColumnDef, DataGrid } from '../../../shared/data-grid/data-grid';
import { IconButton } from '../../../shared/icon-button/icon-button';

interface Application {
  app_id: string;
  app_name: string;
  is_valid: string;
}

interface Group {
  group_id: string;
  group_name: string;
}

@Component({
  selector: 'app-app-group-management',
  imports: [CommonModule, FormsModule, DataGrid, IconButton],
  templateUrl: './app-group-management.html',
  styleUrl: './app-group-management.scss',
})
export class AppGroupManagement {
  constructor(private apiService: ApiService) {}

  currentUsername = 'admin';

  groups: any[] = [];

  selectedGroup: any = null;

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

  loading = false;

  availableColumns: ColumnDef[] = [
    {
      label: 'Application Id',
      field: 'app_id',
      width: '150px',
    },
    {
      label: 'Application Name',
      field: 'app_name',
    },
  ];

  assignedColumns: ColumnDef[] = [
    {
      label: 'Application Id',
      field: 'app_id',
      width: '150px',
    },
    {
      label: 'Application Name',
      field: 'app_name',
    },
  ];

  ngOnInit(): void {
    this.loadGroups();

    this.loadAvailableApplications();
  }
  loadGroups(): void {
    this.apiService.get('groups/lightweight', {}, true).subscribe({
      next: (response: any) => {
        this.groups = response || [];
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  loadAvailableApplications(): void {
    this.apiService.get('applications/lightweight', {}, true).subscribe({
      next: (response: any) => {
        this.availableApplications = response || [];
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  onGroupChange(): void {
    if (!this.selectedGroup) {
      this.assignedApplications = [];
      return;
    }

    this.loadAssignedApplications();
  }
  onPageChange(data: any) {}

  loadAssignedApplications(): void {
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

  onAvailablePageChange(page: number) {
    this.availableCurrentPage = page;
    this.loadAvailableApplications();
  }

  onAssignedPageChange(page: number) {
    this.assignedCurrentPage = page;
    this.loadAssignedApplications();
  }

  removeAssignedFromAvailable(): void {
    const assignedIds = this.assignedApplications.map((x) => x.app_id);

    this.availableApplications = this.availableApplications.filter(
      (x) => !assignedIds.includes(x.app_id),
    );
  }
  onAvailableSelectionChange(rows: Application[]): void {
    this.selectedAvailableApps = rows;
  }

  onAssignedSelectionChange(rows: Application[]): void {
    this.selectedAssignedApps = rows;
  }

  loadApplicationCount(): void {
    this.apiService.get(`groups/${this.selectedGroup}/applications/count`).subscribe({
      next: (count: any) => {
        console.log('Application Count : ', count);
      },

      error: (err) => console.error(err),
    });
  }

  assignApplication(row: Application): void {
    const body = {
      username: this.currentUsername,
    };

    this.apiService
      .post(`groups/${this.selectedGroup}/applications/${row.app_id}`, body, true)
      .subscribe({
        next: () => {
          alert('Application Assigned Successfully');

          this.loadAvailableApplications();
          this.loadAssignedApplications();
          this.loadApplicationCount();
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
  removeApplication(row: Application): void {
    if (!this.selectedGroup) {
      alert('Please select a Group.');
      return;
    }

    const body = {
      username: this.currentUsername,
    };

    this.apiService
      .delete(`groups/${this.selectedGroup}/applications/${row.app_id}`, true, body)
      .subscribe({
        next: () => {
          alert('Application Removed Successfully');

          this.loadAvailableApplications();
          this.loadAssignedApplications();
          this.loadApplicationCount();
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  bulkRemove(): void {
    if (!this.selectedGroup) {
      alert('Please select a Group.');
      return;
    }

    if (this.selectedAssignedApps.length === 0) {
      alert('Please select Applications.');
      return;
    }

    const body = {
      appIds: this.selectedAssignedApps.map((x) => x.app_id),
      username: this.currentUsername,
    };

    this.apiService.post(`groups/${this.selectedGroup}/applications/bulk-remove`, body).subscribe({
      next: () => {
        alert('Applications Removed Successfully');

        this.selectedAssignedApps = [];

        this.loadAvailableApplications();

        this.loadAssignedApplications();

        this.loadApplicationCount();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }
  bulkAssign(): void {
    if (!this.selectedGroup) {
      alert('Please select a Group.');
      return;
    }

    if (this.selectedAvailableApps.length === 0) {
      alert('Please select Applications.');
      return;
    }

    const body = {
      appIds: this.selectedAvailableApps.map((x) => x.app_id),
      username: this.currentUsername,
    };

    this.apiService.post(`groups/${this.selectedGroup}/applications/bulk-assign`, body).subscribe({
      next: () => {
        alert('Applications Assigned Successfully');

        this.selectedAvailableApps = [];

        this.loadAvailableApplications();

        this.loadAssignedApplications();

        this.loadApplicationCount();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }
}
