import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { Combobox } from '../../../shared/combobox/combobox';
import { ColumnDef, DataGrid } from '../../../shared/data-grid/data-grid';
import { DatepickerComponent } from '../../../shared/date-picker/date-picker';

@Component({
  selector: 'app-app-management-history',
  imports: [CommonModule, FormsModule, DatepickerComponent, DataGrid, Combobox],
  templateUrl: './app-management-history.html',
  styleUrl: './app-management-history.scss',
})
export class AppManagementHistory {
  loading = false;
  selectedAction = 'ALL';
  selectedCategory = 'ALL Categories';
  selectedRoleGroup = 'ALL Roles';
  selectedMenuAffected = 'ALL Menus';

  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  gridData = [];

  formData: any = {
    action: null,
    group: null,
    app: null,
    fromDate: null,
    toDate: null,

    actions: [
      { id: 1, name: 'ALL' },
      { id: 2, name: 'ASSIGN' },
      { id: 3, name: 'FREMOVE' },
    ],

    groupValue: [
      { id: 1, name: 'ALL Category' },
      { id: 2, name: 'Group Profiles' },
      { id: 3, name: 'Menu Privileges' },
    ],
    appValue: [
      { id: 1, name: 'ALL Category' },
      { id: 2, name: 'Group Profiles' },
      { id: 3, name: 'Menu Privileges' },
    ],
  };

  gridColumns: ColumnDef[] = [
    {
      label: 'Log ID',
      field: 'logId',
      width: '280px',
    },
    {
      label: 'Date & Time',
      field: 'performedDate',
      align: 'center',
      width: '170px',
    },
    {
      label: 'Action',
      field: 'action',
      align: 'center',
      width: '140px',
    },
    {
      label: 'Performed By',
      field: 'performedBy',
      align: 'center',
      width: '130px',
    },
    {
      label: 'Group ID',
      field: 'groupId',
      align: 'center',
      width: '120px',
    },
    {
      label: 'Group Name',
      field: 'groupName',
      width: '250px',
    },
    {
      label: 'App Id',
      field: 'appId',
      align: 'center',
      width: '120px',
    },
    {
      label: 'App Name',
      field: 'appName',
      width: '220px',
    },
  ];

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const fromDate = new Date();
    fromDate.setDate(today.getDate() - 29);
    this.formData.dateTo = this.formatDate(today);
    this.formData.dateFrom = this.formatDate(fromDate);
    this.fetchGroupData(1);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private get currentApiPayload() {
    return {
      dateFrom: this.formData.dateFrom,
      dateTo: this.formData.dateTo,
      action: this.formData.action || 'ALL',
      groupId: this.formData.group || 'ALL',
      appId: this.formData.app || 'ALL',
    };
  }
  fetchGroupData(targetPage: number = 1): void {
    this.loading = true;

    const payload = this.currentApiPayload;

    const endpoint = `audit/${encodeURIComponent(payload.dateFrom)}/${encodeURIComponent(
      payload.dateTo,
    )}/${payload.action}/${payload.groupId}/${payload.appId}/${targetPage}/${this.pageSize}`;

    this.apiService
      .get(endpoint, {}, true)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          this.gridData = response?.content || [];
          this.totalPages = response?.totalPages || 1;
          this.currentPage = response?.number != null ? response.number + 1 : targetPage;
        },
        error: (error: any) => {
          console.error(error);
          this.gridData = [];
        },
      });
  }

  onRunQuery(): void {
    this.fetchGroupData(1);
  }

  onResetFilters(): void {
    const today = new Date();
    const fromDate = new Date();
    fromDate.setDate(today.getDate() - 29);

    this.formData.fromDate = this.formatDate(fromDate);
    this.formData.toDate = this.formatDate(today);
    this.formData.action = null;
    this.formData.group = null;
    this.formData.app = null;

    this.fetchGroupData(1);
  }

  onExportExcel(): void {
    console.log('Downloading formatted report track schema...');
  }

  onBack(): void {
    this.router.navigate(['/home/app-management']);
  }

  onPageChange(newPage: number): void {
    this.fetchGroupData(newPage);
  }
}
