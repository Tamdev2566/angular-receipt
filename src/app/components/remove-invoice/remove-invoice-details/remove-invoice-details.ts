import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../services/alertService/alert';
import { UserService } from '../../../services/userService/user.service';
import { ColumnDef, DataGrid } from '../../../shared/data-grid/data-grid';
import { RemoveInvoiceService } from '../service/remove-invoice-service';

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
    { label: 'Reference No', field: 'reference_no', width: '150px' },
    { label: 'Reference Date', field: 'reference_date', width: '150px' },
    { label: 'Vessel Name', field: 'vessel_name', width: '170px' },
    { label: 'Voyage No', field: 'voyage_no', width: '110px' },
    { label: 'SGD Amount', field: 'original_sgd', width: '120px' },
    { label: 'USD Amount', field: 'original_usd', width: '120px' },
  ];

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private invoiceService: RemoveInvoiceService,
  ) {}

  retrieveInvoice() {
    this.invoiceService
      .searchInvoices(this.retrieve.customerName, this.retrieve.vesselName, this.retrieve.voyageNo)
      .subscribe((res) => {
        this.invoiceGrid = res;
      });
  }

  removeInvoice() {
    const selectedRecords = this.invoiceGrid.filter((row) => row.isSelected);

    if (selectedRecords.length === 0) {
      this.alertService.showAlert('Error', 'You must Select one Row', 'error');
      return;
    }

    if (!this.remark.trim()) {
      this.alertService.showAlert('Error', 'You must enter Remark', 'error');
      return;
    }

    const referenceNos = selectedRecords.map((row) => row.reference_no);
    const user = this.userService.getUser();

    this.invoiceService.removeInvoices(referenceNos, user.name, this.remark).subscribe({
      next: (res: any) => {
        this.alertService.showAlert('Success', res.message, 'success');
        this.retrieveInvoice();
        this.onCancel();
        this.remark = '';
      },
      error: (err) => {
        this.alertService.showAlert('Error', err.error.message, 'error');
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
    this.invoiceGrid = [];
  }

  onRowSelect(record: any): void {
    this.trackSelectionLogs();
    // this.rowData.setRowData(record);
  }

  trackSelectionLogs(): void {
    const selectedRows = this.paginatedRecords.filter((row) => row.isSelected);
    this.selectedRecord = selectedRows.length === 1 ? selectedRows[0] : null;
  }
}
