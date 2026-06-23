import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { Combobox } from '../../../shared/combobox/combobox';
import { ColumnDef, DataGrid } from '../../../shared/data-grid/data-grid';
import { DatepickerComponent } from '../../../shared/date-picker/date-picker';

@Component({
  selector: 'app-group-mgt-history',
  standalone: true,
  imports: [CommonModule, FormsModule, DatepickerComponent, DataGrid, Combobox],
  templateUrl: './group-mgt-history.html',
  styleUrls: ['./group-mgt-history.scss'],
})
export class GroupMgtHistoryComponent implements OnInit {
  loading = false;
  selectedAction = 'ALL';
  selectedCategory = 'ALL Categories';
  selectedRoleGroup = 'ALL Roles';
  selectedMenuAffected = 'ALL Menus';

  currentPage = 1;
  totalPages = 1;
  pageSize = 20;

  gridData = [];

  formData: any = {
    action: null,
    categoryValue: null,
    role: null,
    menu: null,

    actions: [
      { id: 1, name: 'ALL' },
      { id: 2, name: 'GROUP_CREATE' },
      { id: 3, name: 'GROUP_UPDATE' },
      { id: 4, name: 'GROUP_ENABLE' },
      { id: 5, name: 'GROUP_DISABLE' },
      { id: 6, name: 'MENU_ADD' },
      { id: 7, name: 'MENU_DELETE' },
    ],

    category: [
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
      field: 'createdAt',
      align: 'center',
      width: '170px',
    },
    {
      label: 'Action',
      field: 'actionType',
      align: 'center',
      width: '140px',
    },
    {
      label: 'Modified By',
      field: 'modifiedBy',
      align: 'center',
      width: '130px',
    },
    {
      label: 'Category',
      field: 'tableName',
      align: 'center',
      width: '140px',
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
      label: 'Menu ID',
      field: 'menuId',
      align: 'center',
      width: '120px',
    },
    {
      label: 'Menu Name',
      field: 'menuName',
      width: '220px',
    },
    {
      label: 'Old Value',
      field: 'oldValue',
      width: '250px',
    },
    {
      label: 'New Value',
      field: 'newValue',
      width: '250px',
    },
  ];

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.fetchGroupData(1);
  }

  private get currentApiPayload(): any {
    return {
      dateFrom: '2026-05-23',
      dateTo: '2026-06-22',
    };
  }

  fetchGroupData(targetPage: number = 1): void {
    this.loading = true;

    const endpoint = `?q=/GroupManagements/logs/rbac/${targetPage}/${this.pageSize}/ASC/createdAt`;

    this.apiService
      .post(endpoint, this.currentApiPayload)
      .pipe(
        finalize(() => {
          console.log('FINALIZE CALLED');
          this.loading = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          this.totalPages = response?.totalPages || 1;
          this.currentPage = targetPage;

          this.gridData = response?.content || [];
        },
        error: (error: any) => {
          console.error(error);
          this.gridData = [];
        },
      });
  }
  onRunQuery(): void {
    const payload = {
      dateFrom: this.formData.dateFrom,
      dateTo: this.formData.dateTo,
      action: this.formData.action,
      category: this.formData.categoryValue,
      roleId: this.formData.role,
      menuId: this.formData.menu,
    };

    console.log(payload);

    this.fetchGroupData(1);
  }
  onResetFilters(): void {
    this.selectedAction = 'ALL';
    this.selectedCategory = 'ALL Categories';
    this.selectedRoleGroup = 'ALL Roles';
    this.selectedMenuAffected = 'ALL Menus';
  }

  onExportExcel(): void {
    console.log('Downloading formatted report track schema...');
  }

  onBack(): void {
    this.router.navigate(['/home/group-mgt-list']);
  }
  onPageChange(newPage: number): void {
    this.fetchGroupData(newPage);
  }
}
