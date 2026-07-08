import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-cheque',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-cheque.html',
  styleUrls: ['./update-cheque.scss'],
})
export class UpdateCheque {
  loading = false;

  // ===========================
  // Retrieve Model
  // ===========================

  retrieve = {
    chequeNo: '',
  };

  // ===========================
  // Receipt Details
  // ===========================

  receipt = {
    transactionNo: '',
    customerName: '',
    referenceNo: '',
    currency: '',
    amount: '',
    paidInvoiceTotal: '',
  };

  // ===========================
  // Update Model
  // ===========================

  update = {
    newChequeNo: '',
    remark: '',
  };

  constructor() {}

  // ==================================
  // Retrieve Button Click
  // ==================================

  retrieveCheque(): void {
    if (!this.retrieve.chequeNo.trim()) {
      alert('Please enter Cheque Number');
      return;
    }

    // Dummy data
    // Replace with API call

    this.receipt = {
      transactionNo: 'REC0000123',
      customerName: 'SSL SHIPPING PTE LTD',
      referenceNo: 'REF20260012',
      currency: 'SGD',
      amount: '2,560.00',
      paidInvoiceTotal: '2,560.00',
    };

    console.log('Retrieve API Payload');

    console.log(this.retrieve);
  }

  // ==================================
  // Update Button Click
  // ==================================

  updateCheque(): void {
    if (!this.update.newChequeNo.trim()) {
      alert('Please enter New Cheque Number');
      return;
    }

    const payload = {
      oldChequeNo: this.retrieve.chequeNo,
      newChequeNo: this.update.newChequeNo,
      remark: this.update.remark,
    };

    console.log('Update Payload');

    console.log(payload);

    // TODO:
    // this.apiService.post('/receipt/updateCheque', payload)
  }

  // ==================================
  // Cancel
  // ==================================

  onCancel(): void {
    this.retrieve = {
      chequeNo: '',
    };

    this.receipt = {
      transactionNo: '',
      customerName: '',
      referenceNo: '',
      currency: '',
      amount: '',
      paidInvoiceTotal: '',
    };

    this.update = {
      newChequeNo: '',
      remark: '',
    };
  }
}
