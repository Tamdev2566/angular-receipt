import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataGrid } from '../../../shared/data-grid/data-grid';

@Component({
  selector: 'app-user-mgmt-list',
  standalone: true,
  templateUrl: './user-mgt-list.html',
  styleUrls: ['./user-mgt-list.scss'],
  imports: [CommonModule, FormsModule, DataGrid],
})
export class UserMgtList implements OnInit {
  loading: boolean = false;
  toastMessage: string | null = null;

  userLedgerData: any[] = [];
  filteredRecords: any[] = [];
  paginatedRecords: any[] = [];

  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 5;
  pageNumbers: number[] = [];
  selectedRecord: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserLedger();
  }

  loadUserLedger(): void {
    this.userLedgerData = [
      {
        no: 1,
        userId: 'US0000001',
        userName: 'KIEN',
        fullName: 'KIENS',
        email: 'NUR.ROZIKIN@PRAWEDA.CO.ID',
        defaultLocation: 'JAKARTA',
        defaultOffice: 'SAMUDERA JAKARTA',
        valid: 'Y',
        createdBy: 'SSS',
        dateCreated: '2017-03-13 15:35:00',
        modifiedBy: 'ALFREDO.SIRAIT',
        dateModified: '2026-06-09 19:11:43',
      },
      {
        no: 2,
        userId: 'US0000002',
        userName: 'MR_GLG',
        fullName: 'GILANG PRAMUHENDRA',
        email: 'GP@CGTEKNO.DEV',
        defaultLocation: 'SINGAPORE',
        defaultOffice: 'PT. SAMUDERA SHIPPING SERVICES - SINGAPORE',
        valid: 'N',
        createdBy: 'SSS',
        dateCreated: '2017-05-02 15:00:00',
        modifiedBy: 'RAFLYY',
        dateModified: '2026-05-14 14:38:01',
      },
      {
        no: 3,
        userId: 'US0000003',
        userName: 'GERMAINE',
        fullName: 'GERMAINE',
        email: 'GERMAINE.YEO@SAMUDERA.ID',
        defaultLocation: 'SINGAPORE',
        defaultOffice: 'PT. SAMUDERA SHIPPING SERVICES - SINGAPORE',
        valid: 'Y',
        createdBy: 'SSS',
        dateCreated: '2017-05-02 15:00:00',
        modifiedBy: 'SADRIANSYAH',
        dateModified: '2026-05-14 14:05:19',
      },
      {
        no: 4,
        userId: 'US0000004',
        userName: 'CELINE',
        fullName: 'CELINE',
        email: 'CELINE.TAN@SAMUDERA.ID',
        defaultLocation: 'SINGAPORE',
        defaultOffice: 'PT. SAMUDERA SHIPPING SERVICES - SINGAPORE',
        valid: 'Y',
        createdBy: 'SSS',
        dateCreated: '2017-05-04 15:00:00',
        modifiedBy: 'GLOSSYS',
        dateModified: '2025-10-05 18:41:08',
      },
      {
        no: 5,
        userId: 'US0000005',
        userName: 'JACE',
        fullName: 'JACE TAN',
        email: 'JACE.TAN@SAMUDERA.ID',
        defaultLocation: 'PORT KLANG',
        defaultOffice: 'PT. SAMUDERA SHIPPING SERVICES',
        valid: 'N',
        createdBy: 'SSS',
        dateCreated: '2017-05-05 15:00:00',
        modifiedBy: 'SSS',
        dateModified: '2020-03-23 16:49:42',
      },
      {
        no: 6,
        userId: 'US0000005',
        userName: 'JACE',
        fullName: 'JACE TAN',
        email: 'JACE.TAN@SAMUDERA.ID',
        defaultLocation: 'PORT KLANG',
        defaultOffice: 'PT. SAMUDERA SHIPPING SERVICES',
        valid: 'N',
        createdBy: 'SSS',
        dateCreated: '2017-05-05 15:00:00',
        modifiedBy: 'SSS',
        dateModified: '2020-03-23 16:49:42',
      },
      {
        no: 7,
        userId: 'US0000005',
        userName: 'JACE',
        fullName: 'JACE TAN',
        email: 'JACE.TAN@SAMUDERA.ID',
        defaultLocation: 'PORT KLANG',
        defaultOffice: 'PT. SAMUDERA SHIPPING SERVICES',
        valid: 'N',
        createdBy: 'SSS',
        dateCreated: '2017-05-05 15:00:00',
        modifiedBy: 'SSS',
        dateModified: '2020-03-23 16:49:42',
      },
      {
        no: 8,
        userId: 'US0000005',
        userName: 'JACE',
        fullName: 'JACE TAN',
        email: 'JACE.TAN@SAMUDERA.ID',
        defaultLocation: 'PORT KLANG',
        defaultOffice: 'PT. SAMUDERA SHIPPING SERVICES',
        valid: 'N',
        createdBy: 'SSS',
        dateCreated: '2017-05-05 15:00:00',
        modifiedBy: 'SSS',
        dateModified: '2020-03-23 16:49:42',
      },
      {
        no: 9,
        userId: 'US0000005',
        userName: 'JACE',
        fullName: 'JACE TAN',
        email: 'JACE.TAN@SAMUDERA.ID',
        defaultLocation: 'PORT KLANG',
        defaultOffice: 'PT. SAMUDERA SHIPPING SERVICES',
        valid: 'N',
        createdBy: 'SSS',
        dateCreated: '2017-05-05 15:00:00',
        modifiedBy: 'SSS',
        dateModified: '2020-03-23 16:49:42',
      },
      {
        no: 10,
        userId: 'US0000005',
        userName: 'JACE',
        fullName: 'JACE TAN',
        email: 'JACE.TAN@SAMUDERA.ID',
        defaultLocation: 'PORT KLANG',
        defaultOffice: 'PT. SAMUDERA SHIPPING SERVICES',
        valid: 'N',
        createdBy: 'SSS',
        dateCreated: '2017-05-05 15:00:00',
        modifiedBy: 'SSS',
        dateModified: '2020-03-23 16:49:42',
      },
    ];

    this.filteredRecords = [...this.userLedgerData];
    this.calculatePagination();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredRecords.length / this.pageSize);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePaginationView();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginationView();
    }
  }

  updatePaginationView(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedRecords = this.filteredRecords.slice(startIndex, endIndex);
  }

  toggleValidity(): void {
    console.log('Valid/Invalid toggled for records');
  }

  filterAll(): void {
    console.log('Showing all logs array dataset');
  }

  printLedger(): void {
    window.print();
  }

  viewHistory(): void {
    console.log('Opening auditing history component context');
    this.router.navigate(['/home/user-mgt-history']);
  }

  onSearch(event: any): void {
    const query = event.target.value.toLowerCase();
  }

  onCreateNewUser(): void {
    this.router.navigate(['/home/user-mgt-details']);
  }

  openEditModal(user: any): void {
    console.log('Opening edit modal for user:', user);
  }

  isAllSelected(): boolean {
    if (!this.paginatedRecords.length) return false;
    return this.paginatedRecords.every((row) => row.isSelected);
  }

  toggleAllRows(event: any): void {
    const checked = event.target.checked;
    this.paginatedRecords.forEach((row) => (row.isSelected = checked));
    this.trackSelectionLogs();
  }

  onRowSelect(record: any): void {
    this.trackSelectionLogs();
  }

  trackSelectionLogs(): void {
    const selectedRows = this.paginatedRecords.filter((row) => row.isSelected);

    this.selectedRecord = selectedRows.length === 1 ? selectedRows[0] : null;
  }
}
