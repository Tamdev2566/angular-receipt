import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnDef, DataGrid } from '../../../shared/data-grid/data-grid';
import { ApiService } from '../../../services/api.service';
import { DatepickerComponent } from '../../../shared/date-picker/date-picker';
import { Combobox } from '../../../shared/combobox/combobox';

@Component({
  selector: 'app-user-mgt-history',
  standalone: true,
  imports: [CommonModule, FormsModule, DataGrid, DatepickerComponent, Combobox],
  templateUrl: './user-mgt-history.html',
  styleUrls: ['./user-mgt-history.scss'],
})
export class UserMgtHistoryComponent implements OnInit {
  loading = false;

  dateFrom = new Date();
  dateTo = new Date();

  selectedAction = 'ALL';
  selectedUserAffected = 'ALL USERS';
  selectedOffice = 'ALL OFFICES';
  selectedLocation = 'ALL LOCATIONS';

  logRecords: any[] = [];

  currentPage = 1;
  totalPages = 1;
  pageSize = 20;

  formData: any = {
    action: null,
    userId: null,
    officeId: null,
    locationId: null,

    actions: [
      { id: 1, name: 'ALL' },
      { id: 2, name: 'USER_CREATE' },
      { id: 3, name: 'USER_UPDATE' },
      { id: 4, name: 'USER_ENABLE' },
      { id: 5, name: 'USER_DISABLE' },
      { id: 6, name: 'ASSIGN_LOCATION' },
      { id: 7, name: 'REVOKE_LOCATION' },
      { id: 8, name: 'ASSIGN_GROUP' },
      { id: 9, name: 'REVOKE_GROUP' },
    ],
  };

  gridColumns: ColumnDef[] = [
    {
      label: 'Log ID',
      field: 'logId',
      width: '150px',
    },
    {
      label: 'Date & Time',
      field: 'createdAt',
      align: 'center',
      width: '150px',
    },
    {
      label: 'Action',
      field: 'actionType',
      align: 'center',
      width: '120px',
    },
    {
      label: 'Admin (Created By)',
      field: 'createdBy',
      align: 'center',
      width: '150px',
    },
    {
      label: 'User Affected',
      field: 'userAffectedName',
      align: 'center',
      width: '140px',
    },
    {
      label: 'Office',
      field: 'officeName',
      align: 'center',
      width: '220px',
    },
    {
      label: 'Location',
      field: 'locationName',
      width: '150px',
    },
    {
      label: 'Old State',
      field: 'oldValue',
      width: '250px',
    },
    {
      label: 'New State',
      field: 'newValue',
      width: '250px',
    },
  ];

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    const today = new Date();

    const lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 30);

    this.formData.dateTo = this.formatDate(today);
    this.formData.dateFrom = this.formatDate(lastMonth);

    this.loadHistory();
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  loadHistory(targetPage: number = 1): void {
    this.loading = true;

    const selectedAction = this.formData.actions.find((x: any) => x.id === this.formData.action);

    const payload: any = {
      dateFrom: this.formData.dateFrom,
      dateTo: this.formData.dateTo,
    };

    if (selectedAction && selectedAction.name !== 'ALL') {
      payload.action = selectedAction.name;
    }

    if (this.formData.userId) {
      payload.userId = this.formData.userId;
    }

    if (this.formData.officeId) {
      payload.officeId = this.formData.officeId;
    }

    if (this.formData.locationId) {
      payload.locationId = this.formData.locationId;
    }

    console.log('History Payload:', payload);

    const endPoint = `?q=/UserManagements/logs/user/${targetPage}/${this.pageSize}/DESC/createdAt`;

    this.apiService.post(endPoint, payload).subscribe({
      next: (res: any) => {
        this.logRecords = res?.content || [];
        this.totalPages = res?.totalPages || 1;
        this.currentPage = targetPage;
        this.loading = false;
      },
      error: (err) => {
        console.error('History Load Error', err);
        this.loading = false;
      },
    });
  }

  onRunQuery(): void {
    this.loadHistory();
  }

  onResetFilters(): void {
    this.selectedAction = 'ALL';
    this.selectedUserAffected = 'ALL USERS';
    this.selectedOffice = 'ALL OFFICES';
    this.selectedLocation = 'ALL LOCATIONS';

    this.loadHistory();
  }

  onExportExcel(): void {
    console.log('Export Excel');
  }

  onBack(): void {
    this.router.navigate(['/home/user-mgt-list']);
  }

  onPageChange(newPage: number): void {
    this.loadHistory(newPage);
  }
}
