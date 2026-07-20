import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnDef, DataGrid } from '../../../../shared/data-grid/data-grid';

@Component({
  selector: 'app-outstanding-modal',
  standalone: true,
  imports: [CommonModule, DataGrid],
  templateUrl: './outstanding-modal.html',
  styleUrls: ['./outstanding-modal.scss'],
})
export class OutstandingModal {
  @Input() isOpen = false;
  @Input() customerName = '';
  @Input() records: any[] = [];

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() selectOutstanding = new EventEmitter<any[]>();

  selectedRows: any[] = [];

  columns: ColumnDef[] = [
    { label: 'Customer Name', field: 'CustomerName', width: '180px' },
    { label: 'Currency', field: 'Currency', align: 'center', width: '90px' },
    { label: 'Settlement Amount', field: 'SettlementAmount', width: '140px' },
    { label: 'SGD Amount', field: 'SGDAmount', width: '120px' },
    { label: 'USD Amount', field: 'USDAmount', width: '120px' },
    { label: 'Original SGD', field: 'OriginalSGD', width: '120px' },
    { label: 'Original USD', field: 'OriginalUSD', width: '120px' },
  ];

  close(): void {
    this.isOpen = false;
    this.selectedRows = [];
    this.isOpenChange.emit(this.isOpen);
  }
}
