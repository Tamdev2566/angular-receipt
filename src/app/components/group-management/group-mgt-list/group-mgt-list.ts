import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
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
    };
  }

  fetchGroupData(targetPage: number = 1): void {
    this.loading = true;
    const endpoint = `?q=/GroupManagements/groups/${targetPage}/${this.pageSize}/ASC/groupId`;

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

  // ==================== UI STATE GETTERS ====================

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

  // ==================== EVENT TRIGGERS ====================

  onToggleValidClick(): void {
    if (this.validFilterMode === 'ALL') this.validFilterMode = 'INVALID';
    else if (this.validFilterMode === 'INVALID') this.validFilterMode = 'VALID';
    else this.validFilterMode = 'ALL';

    this.fetchGroupData(1); // Always reset to page 1 on filter change
  }

  onSearch(): void {
    this.fetchGroupData(1); // Always reset to page 1 on new search
  }

  onPageChange(newPage: number): void {
    this.fetchGroupData(newPage);
  }

  onGridSelectionChange(selectedRows: any[]): void {
    this.selectedRows = selectedRows;
    console.log('Selected items count:', this.selectedRows.length);
  }

  viewDetails(row: any): void {
    console.log('Viewing details for:', row);
  }

  deleteUser(id: string): void {
    console.log('Deleting user ID:', id);
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
