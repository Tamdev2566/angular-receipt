import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alertService/alert';
import { MenuAccessService } from '../../services/menu-access';
import { ReportService } from '../../services/reportService/report-service';
import { ColumnDef, DataGrid } from '../../shared/data-grid/data-grid';
import { DatepickerComponent } from '../../shared/date-picker/date-picker';

@Component({
  selector: 'app-updated-tt-ref-report',
  imports: [CommonModule, FormsModule, DatepickerComponent, DataGrid],
  templateUrl: './updated-tt-ref-report.html',
  styleUrl: './updated-tt-ref-report.scss',
})
export class UpdatedTtRefReport {
  formattedFromToDate: string = '';

  constructor(
    private alert: AlertService,
    private apiservice: ReportService,
    private menuAccessService: MenuAccessService,
    private router: Router,
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

  onGenerate(): void {
    this.generateReport();
  }

  generateReport(): void {
    const fromDateApi = this.formatForApi(this.reportForm.fromDate);
    const toDateApi = this.formatForApi(this.reportForm.toDate);
    this.apiservice.getReport('api/reports/updated-tt/getdata', fromDateApi, toDateApi).subscribe({
      next: (res: any) => {
        this.gridData = res || [];
      },
      error: (err: any) => {
        this.alert.showAlert('Error', err.error.message, 'error');
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
          this.apiservice.exportToExcel(res, 'UpdateTTRefReoprt', fromDateApi, toDateApi);
        },
        error: (error: any) => {
          this.alert.showAlert('Error', error.error.message, 'error');
        },
      });
  }

  onCancel(): void {
    this.reportForm = { fromDate: this.formattedFromToDate, toDate: this.formattedFromToDate };
    this.gridData = [];
  }
}
