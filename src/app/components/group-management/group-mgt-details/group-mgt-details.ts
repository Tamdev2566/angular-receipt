import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { PrivilegeModal } from './modal/privilege-modal/privilege-modal';

export interface PrivilegeRow {
  menuId?: string;
  menuName: string;
  accessLevel: string;
}

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [CommonModule, FormsModule, PrivilegeModal],
  templateUrl: './group-mgt-details.html',
  styleUrls: ['./group-mgt-details.scss'],
})
export class GroupMgtDetails implements OnInit {
  loading = false;

  groupId = 'Disabled/Auto-generated';
  groupName = '';
  totalAssignedUsers = 0;
  isValid = true;

  privilegeSearchQuery = '';
  assignedPrivileges: PrivilegeRow[] = [];
  masterMenus: any[] = [];

  createdBy = 'SSS';
  dateCreated = '2026-06-11 13:58:49';
  modifiedBy = '';
  dateModified = '';

  showPrivilegeModal = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    const row = history.state?.row;
    console.log(row);
    if (row) {
      this.getDetails(row);
    }
  }

  getDetails(row: any): void {
    const groupEndpoint = `?q=/GroupManagements/findGroupDetail/${row.id}`;
    const masterEndpoint = `?q=/GroupManagements/findMasterMenus/${row.id}/*/1/10`;

    forkJoin({
      groupDetails: this.apiService.get(groupEndpoint),
      masterMenus: this.apiService.get(masterEndpoint),
    }).subscribe({
      next: (response: any) => {
        const details = response.groupDetails.content[0];

        this.groupId = details.groupId;
        this.groupName = details.groupName;
        this.totalAssignedUsers = details.totalUser;
        this.isValid = details.isValid === 'Y';

        this.createdBy = details.userCreated;
        this.dateCreated = details.dateCreated;
        this.modifiedBy = details.userModified;
        this.dateModified = details.dateModified;

        this.assignedPrivileges = details.assignedPrivileges.map((item: any) => ({
          menuId: item.menuId,
          menuName: item.menuName,
          accessLevel: item.accessLevel.toUpperCase(),
        }));

        this.masterMenus = response.masterMenus.content || [];
      },
      error: (error) => {
        console.error('API Error:', error);
      },
    });
  }

  openPrivilegeModal(): void {
    this.showPrivilegeModal = true;
  }

  onMenusSelected(selectedMenus: any[]): void {
    selectedMenus.forEach((menu) => {
      const exists = this.assignedPrivileges.some((p) => p.menuId === menu.menuId);

      if (!exists) {
        this.assignedPrivileges.push({
          menuId: menu.menuId,
          menuName: menu.menuName,
          accessLevel: 'FULL ACCESS',
        });
      }
    });

    this.showPrivilegeModal = false;
  }

  onSave(): void {
    if (!this.groupName?.trim()) {
      alert('Group Name is required');
      return;
    }

    if (!this.assignedPrivileges.length) {
      alert('Please assign at least one privilege');
      return;
    }

    this.loading = true;

    const payload: any = {
      groupName: this.groupName.trim().toUpperCase(),
      isValid: this.isValid ? 'Y' : 'N',
      assignedPrivileges: this.assignedPrivileges.map((p) => ({
        menuId: p.menuId,
        menuName: p.menuName,
        accessLevel: p.accessLevel === 'FULL ACCESS' ? 'full' : 'read',
      })),
    };

    if (this.groupId && this.groupId !== 'Disabled/Auto-generated') {
      payload.groupId = this.groupId;
    }

    const endpoint = '?q=/GroupManagements/groupSave';

    this.apiService.post(endpoint, payload).subscribe({
      next: (res) => {
        this.loading = false;
        alert(`Group ${this.groupName} saved successfully`);
        this.router.navigate(['/home/group-mgt-list']);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        alert(err?.error?.message || 'Failed to save group');
      },
    });
  }

  onDeepClone(): void {
    const sourceGroupId = prompt('Enter Source Group ID');

    if (!sourceGroupId?.trim()) {
      return;
    }

    this.loading = true;

    const endpoint = `?q=/GroupManagements/findGroupDetail/${sourceGroupId}`;

    this.apiService.get(endpoint).subscribe({
      next: (response: any) => {
        const details = response.content?.[0];

        if (!details) {
          this.loading = false;
          return;
        }

        this.assignedPrivileges = (details.assignedPrivileges || []).map((item: any) => ({
          menuId: item.menuId,
          menuName: item.menuName,
          accessLevel: item.accessLevel?.toLowerCase() === 'full' ? 'FULL ACCESS' : 'READ ONLY',
        }));

        this.loading = false;
        alert('Privileges cloned successfully');
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        alert('Failed to clone privileges');
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/home/group-mgt-list']);
  }

  removePrivilegeRow(index: number): void {
    this.assignedPrivileges.splice(index, 1);
  }
}
