import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DatepickerComponent } from '../../shared/date-picker/date-picker';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnDef, DataGrid } from '../../shared/data-grid/data-grid';
import { ReportService } from '../../services/reportService/report-service';
import { AlertService } from '../../services/alertService/alert';

@Component({
  selector: 'app-removed-invoice-report',
  imports: [CommonModule, FormsModule, DatepickerComponent, DataGrid],
  templateUrl: './removed-invoice-report.html',
  styleUrl: './removed-invoice-report.scss',
})
export class RemovedInvoiceReport {
  private readonly destroyRef = inject(DestroyRef);
  formattedFromToDate: string = '';
  reportForm = { fromDate: '', toDate: '' };
  gridData: any[] = [];

  isSubmitted: boolean = false;
  errors: { [key: string]: boolean } = {};

  gridColumns: ColumnDef[] = [
    { label: 'Removed Invoice', field: 'removedInvoice', width: '130px' },
    { label: 'Invoice Source', field: 'invoiceSource', width: '120px' },
    { label: 'Reason', field: 'reason', width: '130px' },
    { label: 'User Id', field: 'userId', align: 'center', width: '90px' },
    { label: 'Action Date', field: 'actionDate', width: '140px' },
  ];

  constructor(
    private alert: AlertService,
    private apiservice: ReportService,
  ) {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    const formattedToday = `${day}/${month}/${year}`;

    this.reportForm.fromDate = formattedToday;
    this.reportForm.toDate = formattedToday;
    this.formattedFromToDate = formattedToday;
  }

  private formatForApi(dateStr: string): string {
    if (!dateStr || !dateStr.includes('/')) return dateStr;
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }

  validateFields(): boolean {
    const fromDate = this.reportForm.fromDate ? String(this.reportForm.fromDate) : '';
    const toDate = this.reportForm.toDate ? String(this.reportForm.toDate) : '';

    this.errors['fromDate'] = !fromDate.trim();
    this.errors['toDate'] = !toDate.trim();

    const hasErrors = Object.values(this.errors).some((error) => error === true);
    return !hasErrors;
  }

  onGenerate(): void {
    this.isSubmitted = true;

    if (!this.validateFields()) {
      return;
    }

    this.isSubmitted = false;
    const fromDateApi = this.formatForApi(this.reportForm.fromDate);
    const toDateApi = this.formatForApi(this.reportForm.toDate);
    this.apiservice
      .getReport('api/reports/removed-invoice/getdata', fromDateApi, toDateApi)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.gridData = res || [];
        },
        error: (err) => {
          console.error('Failed to load removed invoice report:', err);
          this.alert.showAlert('Error', err.error.message, 'error');
        },
      });
  }

  onDownloadClick() {
    const fromDateApi = this.formatForApi(this.reportForm.fromDate);
    const toDateApi = this.formatForApi(this.reportForm.toDate);
    this.apiservice
      .downloadReport('api/reports/removed-invoice/download', fromDateApi, toDateApi)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: Blob) => {
          this.apiservice.exportToExcel(res, 'RemovedInvoiceReport', fromDateApi, toDateApi);
        },
        error: (err) => {
          console.error('Failed to download removed invoice report:', err);
          this.alert.showAlert('Error', 'Something went wrong!', 'error');
        },
      });
  }

  onCancel(): void {
    this.reportForm = { fromDate: this.formattedFromToDate, toDate: this.formattedFromToDate };
    this.gridData = [];
  }
}
