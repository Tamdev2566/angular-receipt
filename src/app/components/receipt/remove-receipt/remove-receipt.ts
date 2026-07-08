import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColumnDef, DataGrid } from '../../../shared/data-grid/data-grid';

@Component({
  selector: 'app-remove-invoice',

  standalone: true,

  imports: [CommonModule, FormsModule, DataGrid],

  templateUrl: './remove-receipt.html',

  styleUrls: ['./remove-receipt.scss'],
})
export class RemoveReceipt {
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
