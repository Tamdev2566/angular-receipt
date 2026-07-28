import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatepickerComponent } from '../../shared/date-picker/date-picker';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ReportService } from '../../services/reportService/report-service';
import { ColumnDef, DataGrid } from '../../shared/data-grid/data-grid';
import { AlertService } from '../../services/alertService/alert';

@Component({
  selector: 'app-undo-cheque-reader-report',
  imports: [CommonModule, FormsModule, DatepickerComponent, DataGrid],
  templateUrl: './undo-cheque-reader-report.html',
  styleUrl: './undo-cheque-reader-report.scss',
})
export class UndoChequeReaderReport {
  formattedFromToDate: string = '';
  reportForm = { fromDate: '', toDate: '' };
  loading = false;
  gridData: any[] = [];

  gridColumns: ColumnDef[] = [
    { label: 'Cancelled Cheque No', field: 'cancelledChequeNo', width: '130px' },
    { label: 'Full Cheque No', field: 'fullChequeNo', width: '120px' },
    { label: 'Reason', field: 'reason', width: '130px' },
    { label: 'User Id', field: 'userId', align: 'center', width: '90px' },
    { label: 'Action Date', field: 'actionDateString', width: '140px' },
  ];

  constructor(
    private router: Router,
    private apiservice: ReportService,
    private alert: AlertService,
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

  onGenerate(): void {
    const fromDateApi = this.formatForApi(this.reportForm.fromDate);
    const toDateApi = this.formatForApi(this.reportForm.toDate);
    this.apiservice.getReport('api/reports/undo-cheque/getdata', fromDateApi, toDateApi).subscribe({
      next: (res: any) => {
        this.gridData = res || [];
      },
      error: (err) => {
        this.alert.showAlert('Error', err.error.message, 'error');
      },
    });
  }

  onDownloadClick() {
    const fromDateApi = this.formatForApi(this.reportForm.fromDate);
    const toDateApi = this.formatForApi(this.reportForm.toDate);
    this.apiservice
      .downloadReport('api/reports/undo-cheque/download', fromDateApi, toDateApi)
      .subscribe({
        next: (res: Blob) => {
          this.apiservice.exportToExcel(res, 'UndoChequeReaderReport', fromDateApi, toDateApi);
        },
        error: (err) => {
          this.alert.showAlert('Error', err.error.message, 'error');
        },
      });
  }

  onCancel(): void {
    this.reportForm = { fromDate: this.formattedFromToDate, toDate: this.formattedFromToDate };
    this.gridData = [];
  }
}
