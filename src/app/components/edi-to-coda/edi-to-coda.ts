import { Component, OnInit } from '@angular/core';
import { ColumnDef, DataGrid } from '../../shared/data-grid/data-grid';
import { DatepickerComponent } from '../../shared/date-picker/date-picker';
import { ReportService } from '../../services/reportService/report-service';
import { AlertService } from '../../services/alertService/alert';

@Component({
  selector: 'app-edi-to-coda',
  imports: [DataGrid, DatepickerComponent],
  templateUrl: './edi-to-coda.html',
  styleUrl: './edi-to-coda.scss',
})
export class EdiToCoda implements OnInit {
  fromDate: string | null = null;
  toDate: string | null = null;

  fromDateError = false;
  toDateError = false;

  gridData: any[] = [];

  columns: ColumnDef[] = [
    { label: 'Reference No', field: 'referenceNo', width: '170px' },
    { label: 'Customer Name', field: 'customerName', width: '160px' },
    { label: 'Currency', field: 'currency', align: 'center', width: '90px' },
    { label: 'Amount', field: 'amount', width: '120px' },
  ];

  constructor(
    private apiservice: ReportService,
    private alert: AlertService,
  ) {}

  ngOnInit(): void {
    this.setDefaultDates();
  }

  private setDefaultDates(): void {
    const today = new Date();

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    this.toDate = this.formatDateToDisplay(today);
    this.fromDate = this.formatDateToDisplay(oneMonthAgo);
  }

  private formatDateToDisplay(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private formatForApi(dateStr: string): string {
    if (!dateStr) return '';
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  }

  onExport() {
    this.fromDateError = !this.fromDate;
    this.toDateError = !this.toDate;

    if (this.fromDateError || this.toDateError || !this.fromDate || !this.toDate) {
      return;
    }

    const fromDateApi = this.formatForApi(this.fromDate);
    const toDateApi = this.formatForApi(this.toDate);

    this.apiservice.postEdiToCoda('api/ediCoda/export', fromDateApi, toDateApi).subscribe({
      next: (res: any) => {
        if (res.status.match(/SUCCESS/)) {
          this.alert.showAlert('Success', res.message, 'success');
          this.gridData = [];
        } else {
          this.alert.showAlert('Error', res.message, 'error');
        }
      },
      error: (err) => {
        const errorMessage = err?.error?.message || 'Something went wrong while fetching reports.';
        this.alert.showAlert('Error', errorMessage, 'error');
      },
    });
  }

  onCancel() {
    this.setDefaultDates();
    this.fromDateError = false;
    this.toDateError = false;
  }

  retrieveInvoice() {
    this.fromDateError = !this.fromDate;
    this.toDateError = !this.toDate;

    if (this.fromDateError || this.toDateError || !this.fromDate || !this.toDate) {
      return;
    }

    const fromDateApi = this.formatForApi(this.fromDate);
    const toDateApi = this.formatForApi(this.toDate);

    this.apiservice.getReport('api/ediCoda/retrieve', fromDateApi, toDateApi).subscribe({
      next: (res: any) => {
        if (res.length) {
          this.gridData = res || [];
        }
      },
      error: (err) => {
        const errorMessage = err?.error?.message || 'Something went wrong while fetching reports.';
        this.alert.showAlert('Error', errorMessage, 'error');
      },
    });
  }

  onDownloadClick() {
    if (!this.gridData || this.gridData.length === 0) {
      this.alert.showAlert('Warning', 'No data available in the grid to download.', 'warning');
      return;
    }

    const headers = this.columns.map((col) => col.label);
    const fields = this.columns.map((col) => col.field);

    const csvRows: string[] = [];
    csvRows.push(headers.join(',')); // Header row

    this.gridData.forEach((row) => {
      const values = fields.map((field) => {
        const val = row[field] ?? '';
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EDI_To_CODA_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
