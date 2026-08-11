import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnDef, DataGrid } from '../../../../shared/data-grid/data-grid';
import { ModuleService } from '../../../../services/module-service/module-service';

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

  private stateService = inject(ModuleService);

  selectedRows: any[] = [];

  columns: ColumnDef[] = [
    { label: 'Customer Name', field: 'customer_name', width: '250px' },
    { label: 'Reference No', field: 'reference_no', width: '150px' },
    // { label: 'Settlement Amount', field: 'SettlementAmount', width: '140px' },
    { label: 'SGD Amount', field: 'sgd_amount', width: '120px' },
    { label: 'USD Amount', field: 'usd_amount', width: '120px' },
    { label: 'Original SGD', field: 'original_sgd', width: '120px' },
    { label: 'Original USD', field: 'original_usd', width: '120px' },
  ];

  close(): void {
    this.isOpen = false;
    this.selectedRows = [];
    this.isOpenChange.emit(this.isOpen);
    this.stateService.setModalState(false);
  }
}
