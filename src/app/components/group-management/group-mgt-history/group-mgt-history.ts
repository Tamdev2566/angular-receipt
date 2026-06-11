import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-mgt-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-mgt-history.html',
  styleUrls: ['./group-mgt-history.scss'],
})
export class GroupMgtHistoryComponent implements OnInit {
  loading = false;

  dateFrom = '2026-05-12';
  dateTo = '2026-06-11';
  selectedAction = 'ALL';
  selectedCategory = 'ALL Categories';
  selectedRoleGroup = 'ALL Roles';
  selectedMenuAffected = 'ALL Menus';

  rbacLogs = [
    {
      id: '62DB36D9-68A6-43E8-A44D-797BA61773D9',
      dateTime: '2026-06-11 14:23:25',
      action: 'MENU_DELETE',
      modifiedBy: 'CELEST',
      category: 'GROUP_TEMPLATE',
      roleGroup: 'CUSTOMER SERVICE (SIN)',
      menuAffected: 'ACCOUNT PIC',
      oldValue: { MENU_ID: 'MN00196', ACCESS_LEVEL: 'FULL' },
      newValue: null,
    },
    {
      id: '4FC0626C-F938-48DE-A1E3-D9724CE5E5D4',
      dateTime: '2026-06-11 14:23:07',
      action: 'MENU_ADD',
      modifiedBy: 'CELEST',
      category: 'GROUP_TEMPLATE',
      roleGroup: 'CUSTOMER SERVICE (SIN)',
      menuAffected: 'ACCOUNT PIC',
      oldValue: null,
      newValue: { MENU_ID: 'MN00196', ACCESS_LEVEL: 'FULL' },
    },
    {
      id: '97C2C4F4-E6F7-453B-AEDD-9C794F9EB23F',
      dateTime: '2026-06-11 11:46:56',
      action: 'GROUP_CREATE',
      modifiedBy: 'CELEST',
      category: 'GROUP_HEADER',
      roleGroup: 'CUSTOMER (VIEW ONLY)',
      menuAffected: '',
      oldValue: null,
      newValue: { IS_VALID: 'Y', GROUP_NAME: 'CUSTOMER (VIEW ONLY)' },
    },
    {
      id: '05889CAC-5B86-41D0-A50A-82B3E3540421',
      dateTime: '2026-06-11 11:46:56',
      action: 'MENU_ADD',
      modifiedBy: 'CELEST',
      category: 'GROUP_TEMPLATE',
      roleGroup: 'CUSTOMER (VIEW ONLY)',
      menuAffected: 'CUSTOMER (VIEW ONLY)',
      oldValue: null,
      newValue: { MENU_ID: 'MN00233', ACCESS_LEVEL: 'FULL' },
    },
    {
      id: '06205A27-5B34-4893-97C1-542B11D37EDB',
      dateTime: '2026-06-09 15:55:53',
      action: 'GROUP_UPDATE',
      modifiedBy: 'SHIHERN_LIM',
      category: 'GROUP_HEADER',
      roleGroup: 'AGENT CONTROLLER',
      menuAffected: '',
      oldValue: { IS_VALID: 'Y', GROUP_NAME: 'AGENT CONTROLLER' },
      newValue: { IS_VALID: 'N', GROUP_NAME: 'AGENT CONTROLLER' },
    },
    {
      id: '67A74459-79C3-4EC8-BOB1-ABF05813FBCB',
      dateTime: '2026-06-09 15:54:53',
      action: 'GROUP_CREATE',
      modifiedBy: 'SHIHERN_LIM',
      category: 'GROUP_HEADER',
      roleGroup: 'AGENT CONTROLLER',
      menuAffected: '',
      oldValue: null,
      newValue: { IS_VALID: 'Y', GROUP_NAME: 'AGENT CONTROLLER' },
    },
    {
      id: 'D27064A5-CF4F-4B6D-9E37-6FC3E878ADDA',
      dateTime: '2026-06-09 15:54:53',
      action: 'MENU_ADD',
      modifiedBy: 'SHIHERN_LIM',
      category: 'GROUP_TEMPLATE',
      roleGroup: 'AGENT CONTROLLER',
      menuAffected: 'ACCOUNT PIC (VIEW ONLY)',
      oldValue: null,
      newValue: { MENU_ID: 'MN00249', ACCESS_LEVEL: 'FULL' },
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onRunQuery(): void {
    console.log('Fetching RBAC engine trace audits configuration panel...');
  }

  onResetFilters(): void {
    this.dateFrom = '2026-05-12';
    this.dateTo = '2026-06-11';
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
}
