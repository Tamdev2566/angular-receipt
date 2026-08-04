import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MenuAccessService } from '../../services/menu-access';
import { ColumnDef, DataGrid } from '../../shared/data-grid/data-grid';
import { DatepickerComponent } from '../../shared/date-picker/date-picker';

@Component({
  selector: 'app-cheque-reader-report',
  standalone: true,
  imports: [CommonModule, FormsModule, DatepickerComponent, DataGrid],
  templateUrl: './daily-scan-report.html',
  styleUrl: './daily-scan-report.scss',
})
export class DailyScanReport {
  formattedFromToDate: string = '';
  formData = { readerType: 'INBOUND', fromDate: '', toDate: '' };
  loading = false;
  gridData: any[] = [];

  gridColumns: ColumnDef[] = [
    { label: 'Bound', field: 'bound', width: '130px' },
    { label: 'Full Cheque No', field: 'fullChequeNo', width: '130px' },
    { label: 'Cheque No', field: 'chequeNo', width: '120px' },
    { label: 'Bank Name', field: 'bankName', width: '130px' },
    { label: 'Scan User Id', field: 'scanUserId', align: 'center', width: '90px' },
    { label: 'Created On', field: 'createTime', width: '140px' },
    { label: 'Auto Read', field: 'autoRead', width: '140px' },
  ];

  private apiService = inject(ApiService);
  private menuAccessService = inject(MenuAccessService);
  private router = inject(Router);

  constructor() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    const formattedToday = `${day}/${month}/${year}`;

    this.formData.fromDate = formattedToday;
    this.formData.toDate = formattedToday;
    this.formattedFromToDate = formattedToday;
  }

  get isAllowed(): boolean {
    return this.menuAccessService.currentPermission().fullAccess;
  }

  ngOnInit() {
    this.menuAccessService.checkPermissionForUrl(this.router.url);
  }

  private formatForApi(dateStr: string): string {
    if (!dateStr || !dateStr.includes('/')) return dateStr;
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }

  private buildQueryParams() {
    const fromDateApi = this.formatForApi(this.formData.fromDate);
    const toDateApi = this.formatForApi(this.formData.toDate);
    const bound =
      this.formData.readerType === 'INBOUND'
        ? 'I'
        : this.formData.readerType === 'OUTBOUND'
          ? 'O'
          : this.formData.readerType === 'BOTH'
            ? 'IO'
            : 'ALL';

    const params = new HttpParams()
      .set('fromDate', fromDateApi)
      .set('toDate', toDateApi)
      .set('bound', bound);

    return { params, bound, fromDateApi, toDateApi };
  }

  generateReport(): void {
    this.loading = true;
    const { params } = this.buildQueryParams();

    this.apiService.get('api/reports/daily-scan/getdata', { params }).subscribe({
      next: (res: any) => {
        this.gridData = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.loading = false;
      },
    });
  }

  onDownloadClick() {
    const { params, bound, fromDateApi, toDateApi } = this.buildQueryParams();

    this.apiService
      .get('api/reports/daily-scan/download', {
        params,
        responseType: 'blob' as 'json',
      })
      .subscribe({
        next: (res: any) => {
          const blob = new Blob([res], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);

          const now = new Date();
          const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

          const a = document.createElement('a');
          a.href = url;
          a.download = `DailyScanReport_${bound}_${fromDateApi}_to_${toDateApi}_${timestamp}.csv`;
          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error downloading report:', err);
        },
      });
  }

  onCancel(): void {
    this.formData = {
      readerType: 'OUTBOUND',
      fromDate: this.formattedFromToDate,
      toDate: this.formattedFromToDate,
    };
    this.gridData = [];
  }
}
