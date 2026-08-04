import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alertService/alert';
import { MenuAccessService } from '../../services/menu-access';
import { ReportService } from '../../services/reportService/report-service';
import { Combobox } from '../../shared/combobox/combobox';
import { ColumnDef, DataGrid } from '../../shared/data-grid/data-grid';

@Component({
  selector: 'app-aging-report',
  standalone: true,
  imports: [CommonModule, FormsModule, Combobox, DataGrid],
  templateUrl: './aging-report.html',
  styleUrls: ['./aging-report.scss'],
})
export class AgingReport {
  constructor(
    private router: Router,
    private apiservice: ReportService,
    private alert: AlertService,
    private menuAccessService: MenuAccessService,
  ) {}

  loading = false;

  formData = { agingDays: '' };

  agingDayList = [
    { id: 1, name: '1 Days' },
    { id: 2, name: '2 Days' },
    { id: 3, name: '3 Days' },
    { id: 4, name: '4 Days' },
    { id: 5, name: '5 Days' },
    { id: 6, name: '6 Days' },
    { id: 7, name: '7 Days' },
    { id: 8, name: '8 Days' },
    { id: 9, name: '9 Days' },
    { id: 10, name: '10 Days' },
  ];

  gridData: any[] = [];

  gridColumns: ColumnDef[] = [
    { label: 'Cancelled Cheque No', field: 'cancelledChequeNo', width: '130px' },
    { label: 'Full Cheque No', field: 'fullChequeNo', width: '120px' },
    { label: 'Reason', field: 'reason', width: '130px' },
    { label: 'User Id', field: 'userId', align: 'center', width: '90px' },
    { label: 'Action Date', field: 'actionDateString', width: '140px' },
  ];

  get isAllowed(): boolean {
    return this.menuAccessService.currentPermission().fullAccess;
  }

  ngOnInit() {
    this.menuAccessService.checkPermissionForUrl(this.router.url);
  }

  onAgingChange(value: any, item: any): void {
    this.formData.agingDays = value;
  }

  generateReport(): void {
    this.apiservice.getAgingReport('api/reports/aging/getdata', this.formData.agingDays).subscribe({
      next: (res: any) => {
        this.gridData = res || [];
      },
      error: (err) => {
        this.alert.showAlert('Error', err.error.message, 'error');
      },
    });
  }

  onDownloadClick() {
    this.apiservice
      .downloadAgingReport('api/reports/aging/download', this.formData.agingDays)
      .subscribe({
        next: (res: Blob) => {
          this.apiservice.exportToExcelAging(
            res,
            'UndoChequeReaderReport',
            this.formData.agingDays,
          );
        },
        error: (err) => {
          this.alert.showAlert('Error', err.error.message, 'error');
        },
      });
  }

  onCancel(): void {
    this.formData = { agingDays: '' };
  }
}
