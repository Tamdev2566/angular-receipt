import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../services/alertService/alert';
import { UserService } from '../../services/userService/user.service';
import { UpdateChequeService } from './service/update-cheque-service';

@Component({
  selector: 'app-update-cheque',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-cheque.html',
  styleUrls: ['./update-cheque.scss'],
})
export class UpdateCheque {
  loading = false;

  retrieve = {
    chequeNo: '',
  };

  receipt = {
    transactionNo: '',
    customerName: '',
    referenceNo: '',
    currency: '',
    amount: '',
    paidInvoiceTotal: '',
  };

  update = {
    newChequeNo: '',
    remark: '',
  };

  isSubmitted = false;

  constructor(
    private updateChequeService: UpdateChequeService,
    private user: UserService,
    private alert: AlertService,
  ) {}

  retrieveCheque(): void {
    this.isSubmitted = true;

    if (!this.retrieve.chequeNo || !this.retrieve.chequeNo.trim()) {
      return;
    }

    this.isSubmitted = false;

    this.updateChequeService.searchCheque(this.retrieve.chequeNo.trim()).subscribe({
      next: (res: any) => {
        this.receipt = {
          transactionNo: res.transaction_no || '',
          customerName: res.customer_name || '',
          referenceNo: res.reference_no || '',
          currency: res.currency_code || '',
          amount: res.amount !== undefined ? res.amount.toString() : '',
          paidInvoiceTotal:
            res.paid_invoice_total !== undefined ? res.paid_invoice_total.toString() : '',
        };
      },
      error: (err: any) => {
        this.alert.showAlert('Error', err.error?.message || 'Something went wrong!', 'error');
      },
    });
  }

  updateCheque(): void {
    if (!this.update.newChequeNo.trim()) {
      alert('Please enter New Cheque Number');
      return;
    }

    const payload = {
      originalChequeNo: this.retrieve.chequeNo,
      newChequeNo: this.update.newChequeNo,
      transactionNo: this.receipt.transactionNo,
      remark: this.update.remark,
      userId: this.user.getUser().name,
    };

    this.updateChequeService.updateCheque(payload).subscribe({
      next: (res) => {
        this.alert.showAlert('Success', 'Cheque Number Updated Successfully', 'success');
        this.onCancel();
      },
      error: (err) => {
        this.alert.showAlert('Error', err.error?.message || 'Something went wrong!', 'error');
      },
    });
  }

  onCancel(): void {
    this.isSubmitted = false;
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
