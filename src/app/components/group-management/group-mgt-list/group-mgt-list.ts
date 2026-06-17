import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  gridColumns: ColumnDef[] = [
    { label: 'Group ID', field: 'id', align: 'center' },
    { label: 'Profile Name', field: 'name' },
    { label: 'Created By', field: 'createdBy', align: 'center' },
    { label: 'Date Created', field: 'dateCreated', align: 'center' },
    { label: 'Modified By', field: 'modifiedBy', align: 'center' },
    { label: 'Total Users', field: 'totalUsers', align: 'center', type: 'badge' },
    { label: 'Valid', field: 'valid', align: 'center' },
  ];

  gridData = [
    {
      id: 'G00001',
      name: 'BILL OF LADING (OUTWARD) CENTRIC PROFILE',
      createdBy: '',
      dateCreated: '',
      modifiedBy: 'NOVYAN',
      dateModified: '2023-07-17 12:40:33',
      valid: 'Y',
      totalUsers: 4,
      isSelected: false,
      privileges: [
        'ACTUAL FREIGHT LIST: FULL ACCESS',
        'ACTUAL INVOICE: FULL ACCESS',
        'APPROVED RATE SUMMARY: FULL ACCESS',
        '+ 120 MORE MENUS...',
      ],
    },
    {
      id: 'G00037',
      name: 'GENERAL ACCESS PROFILE (VAR 1)',
      createdBy: 'NOVYAN',
      dateCreated: '2025-12-15 19:49:58',
      modifiedBy: 'NOVYAN',
      dateModified: '2025-12-15 19:51:37',
      valid: 'Y',
      totalUsers: 1,
      isSelected: false,
      privileges: ['HOME: FULL ACCESS'],
    },
    {
      id: 'G20001',
      name: 'VESSEL SCHEDULE',
      createdBy: 'SYSTEM_DEPLOY',
      dateCreated: '2026-06-10 12:00:59.284713+07',
      modifiedBy: 'SYSTEM_DEPLOY',
      dateModified: '2026-06-10 12:00:59.284713+07',
      valid: 'Y',
      totalUsers: 0,
      isSelected: false,
      privileges: [
        'SCHEDULE: FULL ACCESS',
        'SERVICE: FULL ACCESS',
        'VESSEL: FULL ACCESS',
        '+ 1 MORE MENU...',
      ],
    },
    {
      id: 'G20002',
      name: 'VESSEL CODE',
      createdBy: 'SYSTEM_DEPLOY',
      dateCreated: '2026-06-10 12:00:59.284713+07',
      modifiedBy: 'SYSTEM_DEPLOY',
      dateModified: '2026-06-10 12:00:59.284713+07',
      valid: 'Y',
      totalUsers: 0,
      isSelected: false,
      privileges: ['VESSEL CODE: FULL ACCESS'],
    },
    {
      id: 'G20003',
      name: 'CENTRAL MASTER',
      createdBy: 'SYSTEM_DEPLOY',
      dateCreated: '2026-06-10 12:00:59.284713+07',
      modifiedBy: 'SYSTEM_DEPLOY',
      dateModified: '2026-06-10 12:00:59.284713+07',
      valid: 'Y',
      totalUsers: 0,
      isSelected: false,
      privileges: [
        'ACCOUNT PIC: FULL ACCESS',
        'CHARGE: FULL ACCESS',
        'COMMODITY: FULL ACCESS',
        '+ 13 MORE MENUS...',
      ],
    },
    {
      id: 'G20004',
      name: 'LOCAL MASTER GENERIC',
      createdBy: 'SYSTEM_DEPLOY',
      dateCreated: '2026-06-10 12:00:59.284713+07',
      modifiedBy: 'SYSTEM_DEPLOY',
      dateModified: '2026-06-10 12:00:59.284713+07',
      valid: 'Y',
      totalUsers: 0,
      isSelected: false,
      privileges: [
        'CLAUSES: FULL ACCESS',
        'EXCHANGE RATE: FULL ACCESS',
        'FREIGHT GROUP: FULL ACCESS',
      ],
    },
    {
      id: 'G20005',
      name: 'LOCAL MASTER (SIN)',
      createdBy: 'SYSTEM_DEPLOY',
      dateCreated: '2026-06-10 12:00:59.284713+07',
      modifiedBy: 'SYSTEM_DEPLOY',
      dateModified: '2026-06-10 12:00:59.284713+07',
      valid: 'Y',
      totalUsers: 0,
      isSelected: false,
      privileges: ['BANK DETAILS: FULL ACCESS', 'CHARGE CODE(GST/ZERO-RATED)...'],
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  isAllSelected(): boolean {
    return this.gridData.every((r) => r.isSelected);
  }

  toggleAllRows(event: any): void {
    const checked = event.target.checked;
    this.gridData.forEach((r) => (r.isSelected = checked));
  }
  onGridSelectionChange(selectedRows: any[]): void {
    console.log('Currently selected rows:', selectedRows);
  }

  viewDetails(row: any) {
    console.log('Viewing details for:', row);
  }

  deleteUser(id: number) {
    console.log('Deleting user ID:', id);
  }

  onCreateButtonClick(): void {
    this.router.navigate(['/home/group-mgt-details']);
  }

  onClickHistory(): void {
    this.router.navigate(['/home/group-mgt-history']);
  }
}
