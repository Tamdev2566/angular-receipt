import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface PrivilegeRow {
  menuName: string;
  accessLevel: string;
}

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  createdBy = 'SSS';
  dateCreated = '2026-06-11 13:58:49';
  modifiedBy = '';
  dateModified = '';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onSave(): void {
    const payload = {
      groupName: this.groupName,
      valid: this.isValid ? 'Y' : 'N',
      privileges: this.assignedPrivileges,
    };
    console.log('Committing Group Management Profile Matrix:', payload);
  }

  onCancel(): void {
    this.router.navigate(['/home/group-mgt-list']);
  }

  onDeepClone(): void {
    console.log('Cloning matrix structure profiles routing configuration routine...');
  }

  addPrivilegeRow(): void {
    this.assignedPrivileges.push({
      menuName: '',
      accessLevel: 'FULL ACCESS',
    });
  }

  removePrivilegeRow(index: number): void {
    this.assignedPrivileges.splice(index, 1);
  }
}
