import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatepickerComponent } from '../../shared/date-picker/date-picker';
import { ColumnDef, DataGrid } from '../../shared/data-grid/data-grid';
import { ReportService } from '../../services/reportService/report-service';

@Component({
  selector: 'app-updated-tt-ref-report',
  imports: [CommonModule, FormsModule, DatepickerComponent, DataGrid],
  templateUrl: './updated-tt-ref-report.html',
  styleUrl: './updated-tt-ref-report.scss',
})
export class UpdatedTtRefReport {
  constructor(
    private router: Router,
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

  loading = false;

  gridData: any[] = [];

  gridColumns: ColumnDef[] = [
    { label: 'Transaction No', field: 'transactionNo', width: '130px' },
    { label: 'Original TT No', field: 'originalTtNo', width: '120px' },
    { label: 'New TT No', field: 'newTtNo', width: '130px' },
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
    this.generateReport();
  }

  generateReport(): void {
    const fromDateApi = this.formatForApi(this.reportForm.fromDate);
    const toDateApi = this.formatForApi(this.reportForm.toDate);
    this.apiservice.getReport('api/reports/updated-tt/getdata', fromDateApi, toDateApi).subscribe({
      next: (res: any) => {
        console.log('res', res);
        this.gridData = res || [];
      },
      error: (err: any) => {
        console.log('err', err);
      },
    });
  }

  onDownloadClick() {
    const fromDateApi = this.formatForApi(this.reportForm.fromDate);
    const toDateApi = this.formatForApi(this.reportForm.toDate);
    this.apiservice
      .downloadReport('api/reports/updated-tt/download', fromDateApi, toDateApi)
      .subscribe({
        next: (res: Blob) => {
          console.log('res', res);
          this.apiservice.exportToExcel(res, 'UpdateTTRefReoprt', fromDateApi, toDateApi);
        },
        error: (error: any) => {
          console.log('err', error);
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
