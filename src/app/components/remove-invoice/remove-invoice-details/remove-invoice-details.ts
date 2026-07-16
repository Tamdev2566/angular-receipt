import { Component, input } from '@angular/core';
import { ColumnDef, DataGrid } from '../../../shared/data-grid/data-grid';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/userService/user.service';
import { ApiService } from '../../../services/api.service';
import { AlertService } from '../../../services/alertService/alert';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-remove-invoice-details',
  imports: [CommonModule, FormsModule, DataGrid],
  templateUrl: './remove-invoice-details.html',
  styleUrl: './remove-invoice-details.scss',
})
export class RemoveInvoiceDetails {
  paginatedRecords: any[] = [];
  selectedRecord: any = null;

  retrieve = {
    customerName: '',
    vesselName: '',
    voyageNo: '',
  };

  remark = '';

  invoiceGrid: any[] = [];

  loading: boolean = false;
  recordData = input<any>();

  invoiceColumns: ColumnDef[] = [
    { label: 'Type', field: 'type', width: '90px' },
    { label: 'Reference No', field: 'referenceNo', width: '150px' },
    { label: 'Reference Date', field: 'referenceDate', width: '150px' },
    { label: 'Vessel Name', field: 'vesselName', width: '170px' },
    { label: 'Voyage No', field: 'voyageNo', width: '110px' },
    { label: 'SGD Amount', field: 'sgdAmount', width: '120px' },
    { label: 'USD Amount', field: 'usdAmount', width: '120px' },
  ];

  constructor(
    private userService: UserService,
    private apiService: ApiService,
    private alertService: AlertService,
    private router: Router,
  ) {}

  retrieveInvoice() {}

  removeInvoice() {
    const user = this.userService.getUser();
    console.log(user);

    const payload = {
      userId: user.name || 'admin_user',
      reason: this.remark || 'Duplicate invoice generation',
      invoices: [
        {
          referenceNo: this.recordData().referenceNo || '',
          source: 'DocSys',
        },
      ],
    };

    console.log('payload', payload);

    this.apiService
      .post('api/receiptRemoveInvoice', payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          this.alertService.showAlert('Success', res.message, 'success');
        },
        error: (error) => {
          this.alertService.showAlert(
            'Error',
            error?.error?.message || 'Unable to Remove Invoice.',
            'error',
          );
        },
      });
  }

  onCancel() {
    // history.back();
    this.retrieve = {
      customerName: '',
      vesselName: '',
      voyageNo: '',
    };

    this.remark = '';
  }

  onRowSelect(record: any): void {
    this.trackSelectionLogs();
    console.log('record', record);
    // this.rowData.setRowData(record);
  }

  trackSelectionLogs(): void {
    const selectedRows = this.paginatedRecords.filter((row) => row.isSelected);

    this.selectedRecord = selectedRows.length === 1 ? selectedRows[0] : null;
  }
}
