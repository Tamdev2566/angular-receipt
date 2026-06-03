import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-undo-receipt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './undo-receipts.html',
})
export class UndoReceiptComponent implements OnInit {
  @Input() record: any;
  @Input() allRecords: any[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<string>();

  searchInvoice = '';
  searchBl = '';
  searchCheque = '';

  ngOnInit() {
    if (this.record) {
      this.searchInvoice = this.record.invoiceNo;
      this.searchBl = this.record.blNo;
      this.searchCheque = this.record.chequeNo;
    }
  }

  retrieveReplicaData() {
    const matched = this.allRecords.find(
      (item) =>
        (this.searchInvoice &&
          item.invoiceNo.toLowerCase().includes(this.searchInvoice.toLowerCase())) ||
        (this.searchBl && item.blNo.toLowerCase().includes(this.searchBl.toLowerCase())) ||
        (this.searchCheque &&
          item.chequeNo.toLowerCase().includes(this.searchCheque.toLowerCase())),
    );

    if (matched) {
      this.record = matched;
      this.success.emit('Match updated from ledger database.');
    } else {
      this.success.emit('No direct matched reference found.');
    }
  }

  commitUndo() {
    if (!this.record) return;
    this.record.status = 'Unverified';
    this.success.emit(`Invoice verification rollback processed: ${this.record.invoiceNo}`);
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }
}
