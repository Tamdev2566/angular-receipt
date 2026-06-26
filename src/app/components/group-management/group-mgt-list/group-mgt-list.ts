import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import * as XLSX from 'xlsx-js-style';
import { ApiService } from '../../../services/api.service';

import { ColumnDef, DataGrid } from '../../../shared/data-grid/data-grid';
import { IconButton } from '../../../shared/icon-button/icon-button';
@Component({
  selector: 'app-group-mgt-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DataGrid, IconButton],
  templateUrl: './group-mgt-list.html',
  styleUrls: ['./group-mgt-list.scss'],
})
export class GroupMgtList implements OnInit {
  loading = false;
  searchQuery = '';

  currentPage = 1;
  totalPages = 1;
  pageSize = 20;
  validFilterMode: 'ALL' | 'INVALID' | 'VALID' = 'ALL';

  gridColumns: ColumnDef[] = [
    { label: 'Group ID', field: 'id', align: 'center', width: '120px' },
    { label: 'Profile Name', field: 'name' },
    { label: 'Created By', field: 'createdBy', align: 'center', width: '130px' },
    { label: 'Date Created', field: 'dateCreated', align: 'center', width: '160px' },
    { label: 'Modified By', field: 'modifiedBy', align: 'center', width: '130px' },
    { label: 'Total Users', field: 'totalUsers', align: 'center', type: 'badge', width: '110px' },
    { label: 'Valid', field: 'valid', align: 'center', width: '80px' },
  ];

  gridData: any[] = [];
  selectedRows: any[] = [];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.fetchGroupData(1);
  }

  private get currentApiPayload(): any {
    if (this.validFilterMode === 'ALL') {
      return {
        search: this.searchQuery.trim(),
      };
    }
    return {
      isValid: this.validFilterMode === 'VALID' ? 'Y' : 'N',
      ...(this.searchQuery && { search: this.searchQuery.trim() }),
    };
  }

  fetchGroupData(targetPage: number = 1, sort: string = 'DESC'): void {
    this.loading = true;
    const endpoint = `?q=/GroupManagements/groups/${targetPage}/${this.pageSize}/${sort}/groupId`;

    this.apiService
      .post(endpoint, this.currentApiPayload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response: any) => {
          const dataList = response?.content || response?.data || response || [];

          this.totalPages = response?.totalPages || 1;
          this.currentPage = targetPage;

          this.gridData = dataList.map((item: any) => {
            let formattedPrivileges: string[] = [];

            if (item.privilegePreview && Array.isArray(item.privilegePreview)) {
              const previewItems = item.privilegePreview.slice(0, 3);
              formattedPrivileges = previewItems.map(
                (priv: any) =>
                  `${priv.menuName ? priv.menuName.toUpperCase() : ''}: ${priv.accessSummary ? priv.accessSummary.toUpperCase() : 'FULL ACCESS'}`,
              );

              const totalMenus = item.totalMenuCount || 0;
              if (totalMenus > 3) {
                const moreCount = totalMenus - 3;
                formattedPrivileges.push(`+ ${moreCount} MORE MENU${moreCount > 1 ? 'S' : ''}...`);
              }
            }

            return {
              id: item.groupId,
              name: item.groupName,
              createdBy: item.userCreated ? item.userCreated.toUpperCase() : '',
              dateCreated: this.formatDate(item.dateCreated),
              modifiedBy: item.userModified ? item.userModified.toUpperCase() : '',
              dateModified: this.formatDate(item.dateModified),
              valid: item.isValid,
              totalUsers: item.totalUsers,
              isSelected: false,
              privileges: formattedPrivileges,
            };
          });
        },
        error: (error: any) => {
          console.error('Error fetching group data:', error);
          this.gridData = [];
        },
      });
  }

  get validButtonText(): string {
    if (this.validFilterMode === 'INVALID') return 'Invalid';
    if (this.validFilterMode === 'VALID') return 'Valid';
    return 'All';
  }

  get validButtonIcon(): string {
    if (this.validFilterMode === 'INVALID') return 'fa-xmark';
    if (this.validFilterMode === 'VALID') return 'fa-check';
    return 'fa-check-double';
  }

  onToggleValidClick(): void {
    if (this.validFilterMode === 'ALL') this.validFilterMode = 'INVALID';
    else if (this.validFilterMode === 'INVALID') this.validFilterMode = 'VALID';
    else this.validFilterMode = 'ALL';

    this.fetchGroupData(1);
  }

  onDownloadExcel(): void {
    if (!this.gridData || this.gridData.length === 0) {
      alert('No records found to download!');
      return;
    }

    const excelReadyData = this.gridData.map((item: any, index: number) => ({
      'S.No': index + 1,
      'Group ID': item.id || '',
      'Profile Name': item.name || '',
      'Created By': item.createdBy || '',
      'Date Created': item.dateCreated || '',
      'Modified By': item.modifiedBy || '',
      'Date Modified': item.dateModified || '',
      'Total Users': item.totalUsers || 0,
      Status: item.valid === 'Y' ? 'Valid' : 'Invalid',
      'Preview Privileges': Array.isArray(item.privileges) ? item.privileges.join('  |  ') : '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelReadyData);

    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        const cell = worksheet[cellAddress];

        if (!cell) continue;

        if (row === 0) {
          cell.s = {
            fill: {
              fgColor: { rgb: '33708F' },
            },
            font: {
              color: { rgb: 'FFFFFF' },
              bold: true,
              sz: 11,
            },
            alignment: {
              horizontal: 'center',
              vertical: 'center',
            },
            border: {
              top: { style: 'thin', color: { rgb: '1E4B63' } },
              bottom: { style: 'medium', color: { rgb: '1E4B63' } },
              left: { style: 'thin', color: { rgb: '1E4B63' } },
              right: { style: 'thin', color: { rgb: '1E4B63' } },
            },
          };
        } else {
          cell.s = {
            font: { sz: 10, color: { rgb: '333333' } },
            alignment: {
              horizontal: col === 2 || col === 9 ? 'left' : 'center',
              vertical: 'center',
            },
            border: {
              top: { style: 'thin', color: { rgb: 'E2E8F0' } },
              bottom: { style: 'thin', color: { rgb: 'E2E8F0' } },
              left: { style: 'thin', color: { rgb: 'E2E8F0' } },
              right: { style: 'thin', color: { rgb: 'E2E8F0' } },
            },
          };

          if (col === 8) {
            cell.s.font.color = cell.v === 'Valid' ? { rgb: '10B981' } : { rgb: 'EF4444' };
            cell.s.font.bold = true;
          }
        }
      }
    }

    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 12 },
      { wch: 35 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 12 },
      { wch: 12 },
      { wch: 55 },
    ];

    worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Groups List');

    const today = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `Group_Management_List_${today}.xlsx`);
  }

  onSearch(): void {
    this.fetchGroupData(1, 'ASC');
  }

  onPageChange(newPage: number): void {
    this.fetchGroupData(newPage);
  }

  onGridSelectionChange(selectedRows: any[]): void {
    this.selectedRows = selectedRows;
    console.log('Selected items count:', this.selectedRows.length);
  }

  viewDetails(row: any): void {
    this.router.navigate(['home/group-mgt-details'], {
      state: { row },
    });
  }

  toggleStatus(row: any): void {
    const newStatus = row.valid === 'Y' ? 'N' : 'Y';

    const payload = {
      groupId: row.id,
      isValid: newStatus,
    };

    this.loading = true;

    this.apiService
      .post('?q=/GroupManagements/updateStatus', payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          row.valid = newStatus;

          alert(
            newStatus === 'Y' ? 'Group Activated Successfully' : 'Group Deactivated Successfully',
          );
        },
        error: (err) => {
          console.error(err);
          alert('Failed to update status');
        },
      });
  }

  bulkToggleStatus(): void {
    if (!this.selectedRows.length) {
      alert('Please select at least one group');
      return;
    }

    const payload = {
      groups: this.selectedRows.map((x) => ({
        groupId: x.id,
        isValid: x.valid === 'Y' ? 'N' : 'Y',
      })),
    };

    this.loading = true;

    this.apiService
      .post('?q=/GroupManagements/bulkUpdateStatus', payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.selectedRows.forEach((row) => {
            row.valid = row.valid === 'Y' ? 'N' : 'Y';
          });

          alert('Status Updated Successfully');
          this.fetchGroupData(this.currentPage);
        },
        error: (err) => {
          console.error(err);
          alert('Failed to update status');
        },
      });
  }

  onCreateButtonClick(): void {
    this.router.navigate(['/home/group-mgt-details']);
  }

  onClickHistory(): void {
    this.router.navigate(['/home/group-mgt-history']);
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return dateStr.includes(':') ? dateStr : `${dateStr} 00:00:00`;
  }
}
