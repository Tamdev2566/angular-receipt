import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-tt-reference',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-tt-reference.html',
  styleUrls: ['./update-tt-reference.scss'],
})
export class UpdateTtReference {
  constructor(private router: Router) {}

  /* Retrieve Section */

  retrieve = {
    ttRefNo: '',
  };

  /* Receipt Details */

  receipt = {
    transactionNo: '',
    customerName: '',
    referenceNo: '',
    currency: '',
    amount: '',
    paidInvoiceTotal: '',
  };

  /* Update Section */

  update = {
    newTTRefNo: '',
    remark: '',
  };

  loading = false;

  /* Retrieve */

  retrieveTTReference(): void {
    console.log('Retrieve TT Ref');

    // Dummy Data

    this.receipt = {
      transactionNo: '2605110002',
      customerName: 'SM LINE CORPORATION - SINGAPORE',
      referenceNo: this.retrieve.ttRefNo,
      currency: 'SGD',
      amount: '5249.44',
      paidInvoiceTotal: '5249.44',
    };
  }

  /* Update */

  updateTTReference(): void {
    if (!this.update.newTTRefNo.trim()) {
      alert('Please enter New TT Reference Number');
      return;
    }

    if (!this.update.remark.trim()) {
      alert('Please enter Remark');
      return;
    }

    const payload = {
      oldTTReference: this.retrieve.ttRefNo,
      newTTReference: this.update.newTTRefNo,
      remark: this.update.remark,
    };

    console.log(payload);

    // API Call Here
  }

  /* Cancel */

  onCancel(): void {
    this.router.navigate(['/home/receipts']);
  }

  /* Header Button Click */

  onUpdate(): void {
    this.updateTTReference();
  }
}
