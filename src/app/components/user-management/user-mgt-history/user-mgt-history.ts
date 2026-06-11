import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-mgt-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-mgt-history.html',
  styleUrls: ['./user-mgt-history.scss'],
})
export class UserMgtHistoryComponent implements OnInit {
  loading = false;

  dateFrom = '2026-05-12';
  dateTo = '2026-06-11';
  selectedAction = 'ALL';
  selectedUserAffected = 'ALL USERS';
  selectedOffice = 'ALL OFFICES';
  selectedLocation = 'ALL LOCATIONS';

  logRecords = [
    {
      id: 'LOG-U1455',
      dateTime: '2026-06-11 14:28:44',
      action: 'ASSIGN_GROUP',
      admin: 'SHIHERN_LIM',
      userAffected: 'NELSON',
      userId: 'US0000689',
      office: 'SAMUDERA KOBE',
      officeId: 'OF105',
      location: 'KOBE',
      oldState: null,
      newState: {
        GROUPS: [
          { GROUPID: 'G20030', GROUPNAME: 'SAILING SCHEDULE' },
          { GROUPID: 'G20036', GROUPNAME: 'OUTWARD DOCS' },
          { GROUPID: 'G20037', GROUPNAME: 'BL AUTO CREATION (NON-SIN)' },
          { GROUPID: 'GRP12665', GROUPNAME: 'SALES AND MARKETING' },
          { GROUPID: 'GRP12669', GROUPNAME: 'SIN OPS' },
        ],
      },
    },
    {
      id: 'LOG-U7750',
      dateTime: '2026-06-11 11:13:58',
      action: 'USER_CREATE',
      admin: 'SHIHERN_LIM',
      userAffected: 'NELSON',
      userId: 'US0000689',
      office: '',
      officeId: '',
      location: '',
      oldState: null,
      newState: {
        EMAIL: 'NELSON@GMAIL.COM',
        PHONE: '',
        USER_ID: 'US0000689',
        IS_VALID: 'Y',
        FULL_NAME: 'NELSON',
        OFFICE_ID: 'OF044',
      },
    },
  ];
  constructor(private router: Router) {}

  ngOnInit(): void {}

  onRunQuery(): void {
    console.log('Executing parameters routing matrix query logs...');
  }

  onResetFilters(): void {
    this.dateFrom = '2026-05-12';
    this.dateTo = '2026-06-11';
    this.selectedAction = 'ALL';
    this.selectedUserAffected = 'ALL USERS';
    this.applyQueryRouting();
  }

  onExportExcel(): void {
    console.log('Downloading spreadsheet stream formatting routine...');
  }

  onBack(): void {
    console.log('Navigating context step back...');
    this.router.navigate(['/home/user-mgt-list']);
  }

  applyQueryRouting(): void {
    // Local query calculation engine placeholder
  }
}
