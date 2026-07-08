import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ColumnDef, DataGrid } from '../../../../shared/data-grid/data-grid';

@Component({
  selector: 'app-remove-receipt',

  standalone: true,

  imports: [CommonModule, FormsModule, DataGrid],

  templateUrl: './remove-receipts.html',
})
export class RemoveReceiptComponent implements OnInit, OnDestroy {
  @Input() record: any;

  @Input() allRecords: any[] = [];

  @Output() close = new EventEmitter<void>();

  @Output() success = new EventEmitter<any>();

  @Output() toast = new EventEmitter<string>();

  inputCustomer = '';

  inputVessel = '';

  inputVoyage = '';

  removalRemark = '';

  matches: any[] = [];

  selectedIds: string[] = [];

  invoiceColumns: ColumnDef[] = [
    {
      label: 'Invoice No',
      field: 'invoiceNo',
    },

    {
      label: 'Customer Name',
      field: 'customerName',
    },

    {
      label: 'Vessel Name',
      field: 'vesselName',
    },

    {
      label: 'Voyage No',
      field: 'voyageNo',
    },

    {
      label: 'BL No',
      field: 'blNo',
    },

    {
      label: 'Amount',
      field: 'amount',
      align: 'end',
    },
  ];

  ngOnInit() {
    if (this.record) {
      this.inputCustomer = this.record.customerName;

      this.inputVessel = this.record.vesselName;

      this.inputVoyage = this.record.voyageNo;

      this.matches = [this.record];

      this.selectedIds = [this.record.id];
    }

    document.body.classList.add('receipt-open');
  }

  ngOnDestroy() {
    document.body.classList.remove('receipt-open');
  }

  retrieveRemoveModalData() {
    this.matches = this.allRecords.filter((item) => {
      const customerMatch =
        !this.inputCustomer ||
        item.customerName

          ?.toLowerCase()

          .includes(this.inputCustomer.toLowerCase());

      const vesselMatch =
        !this.inputVessel ||
        item.vesselName

          ?.toLowerCase()

          .includes(this.inputVessel.toLowerCase());

      const voyageMatch =
        !this.inputVoyage ||
        item.voyageNo

          ?.toLowerCase()

          .includes(this.inputVoyage.toLowerCase());

      return customerMatch && vesselMatch && voyageMatch;
    });

    this.toast.emit(`Found ${this.matches.length} records`);
  }

  toggleSelection(id: string) {
    const index = this.selectedIds.indexOf(id);

    if (index > -1) {
      this.selectedIds.splice(
        index,

        1,
      );
    } else {
      this.selectedIds.push(id);
    }
  }

  isSelected(id: string) {
    return this.selectedIds.includes(id);
  }

  commitRemove() {
    if (!this.removalRemark.trim()) {
      this.toast.emit('Removal reason required');

      return;
    }

    if (this.selectedIds.length === 0) {
      this.toast.emit('Select invoice');

      return;
    }

    this.success.emit({
      ids: this.selectedIds,

      msg: `Removed ${this.selectedIds.length} invoice(s)`,
    });

    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }
}
