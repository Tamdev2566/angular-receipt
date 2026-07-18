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

  constructor(
    private updateChequeService: UpdateChequeService,
    private user: UserService,
    private alert: AlertService,
  ) {}

  retrieveCheque(): void {
    if (!this.retrieve.chequeNo.trim()) {
      alert('Please enter Cheque Number');
      return;
    }

    this.updateChequeService.searchCheque(this.retrieve.chequeNo.trim()).subscribe({
      next: (res) => {
        this.receipt = res;
      },
      error: (err) => {},
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
      },
      error: (err) => {
        this.alert.showAlert('Error', err, 'error');
      },
    });
  }

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
