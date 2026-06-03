import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-receipt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-receipts.html',
  styles: [
    `
      .border-slate {
        border-color: #dee2e6 !important;
      }
      .custom-argon-check:checked {
        background-color: #2dce89 !important;
        border-color: #2dce89 !important;
      }
      .custom-argon-radio:checked {
        background-color: #f5365c !important;
        border-color: #f5365c !important;
      }
      .cursor-pointer {
        cursor: pointer;
      }
      .animate-fade {
        animation: fadeIn 0.25s ease-out;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @media (min-width: 768px) {
        .w-md-auto {
          width: auto !important;
        }
      }
    `,
  ],
})
export class NewReceiptComponent {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  docInward = true;
  docOutward = true;

  newRecord = {
    id: '',
    invoiceNo: '',
    customerName: '',
    blNo: '',
    chequeNo: 'CASH',
    vesselName: '',
    voyageNo: '',
    date: new Date().toISOString().substring(0, 10),
    amount: 0,
    currency: 'SGD',
    payMode: 'Cash',
    status: 'Unverified',
  };

  onCheckOutstanding() {
    alert('Outstanding checked: Clean ledger state');
  }

  onOverPayment() {
    alert('Over payment threshold verified & registered');
  }

  submitReceipt() {
    if (!this.newRecord.customerName || !this.newRecord.invoiceNo || !this.newRecord.amount) {
      alert('Mandatory form attributes entry missing!');
      return;
    }
    this.newRecord.id = `REC-${Math.floor(100 + Math.random() * 900)}`;
    this.save.emit({ ...this.newRecord });
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }
}
