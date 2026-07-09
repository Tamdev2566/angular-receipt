import { Component } from '@angular/core';
import { ColumnDef, DataGrid } from '../../../shared/data-grid/data-grid';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  invoiceColumns: ColumnDef[] = [
    { label: 'Type', field: 'type', width: '90px' },
    { label: 'Reference No', field: 'referenceNo', width: '150px' },
    { label: 'Reference Date', field: 'referenceDate', width: '150px' },
    { label: 'Vessel Name', field: 'vesselName', width: '170px' },
    { label: 'Voyage No', field: 'voyageNo', width: '110px' },
    { label: 'SGD Amount', field: 'sgdAmount', width: '120px' },
    { label: 'USD Amount', field: 'usdAmount', width: '120px' },
  ];

  retrieveInvoice() {}

  removeInvoice() {}

  onCancel() {
    history.back();
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
