import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatepickerComponent } from '../../shared/date-picker/date-picker';
import { ReportService } from '../../services/reportService/report-service';
import { ColumnDef, DataGrid } from '../../shared/data-grid/data-grid';
import { AlertService } from '../../services/alertService/alert';

@Component({
  selector: 'app-updated-cheque-report',
  standalone: true,
  imports: [CommonModule, FormsModule, DatepickerComponent, DataGrid],
  templateUrl: './updated-cheque-report.html',
  styleUrls: ['./updated-cheque-report.scss'],
})
export class UpdatedChequeReport {
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
  }

  reportForm = {
    fromDate: '',
    toDate: '',
  };

  gridData: any[] = [];

  gridColumns: ColumnDef[] = [
    { label: 'Transaction No', field: 'transactionNo', width: '130px' },
    { label: 'Original Cheque No', field: 'originalChequeNo', width: '120px' },
    { label: 'New Cheque No', field: 'newChequeNo', width: '130px' },
    { label: 'User Id', field: 'userId', align: 'center', width: '90px' },
    { label: 'Action Date', field: 'actionDate', width: '140px' },
    { label: 'Reason', field: 'reason', width: '140px' },
  ];

  private formatForApi(dateStr: string): string {
    if (!dateStr || !dateStr.includes('/')) return dateStr;
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }

  onGenerate(): void {
    const fromDateApi = this.formatForApi(this.reportForm.fromDate);
    const toDateApi = this.formatForApi(this.reportForm.toDate);
    this.apiservice
      .getReport('api/reports/updated-cheque/getdata', fromDateApi, toDateApi)
      .subscribe({
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
      .downloadReport('api/reports/updated-cheque/download', fromDateApi, toDateApi)
      .subscribe({
        next: (res: Blob) => {
          this.apiservice.exportToExcel(res, 'UpdatedChequeReport', fromDateApi, toDateApi);
        },
        error: (err) => {
          this.alert.showAlert('Error', err.error.message, 'error');
        },
      });
  }

  onCancel(): void {
    this.reportForm = {
      fromDate: '',
      toDate: '',
    };
  }
}
