import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../services/alertService/alert';
import { UserService } from '../../services/userService/user.service';
import { TtReferene } from './service/tt-referene';

@Component({
  selector: 'app-update-tt-reference',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-tt-reference.html',
  styleUrls: ['./update-tt-reference.scss'],
})
export class UpdateTtReference {
  constructor(
    private alert: AlertService,
    private ttrefService: TtReferene,
    private user: UserService,
  ) {}

  retrieve = {
    ttRefNo: '',
  };

  receipt = {
    transaction_no: '',
    customer_name: '',
    reference_no: '',
    currency_code: '',
    amount: '',
    paid_invoice_total: '',
  };

  update = {
    newTTRefNo: '',
    remark: '',
  };

  loading = false;

  retrieveTTReference(): void {
    if (!this.retrieve.ttRefNo.trim()) {
      this.alert.showAlert('Error', 'Please enter TT/Ref Number', 'error');
      return;
    }

    this.ttrefService.searchTT(this.retrieve.ttRefNo.trim()).subscribe({
      next: (res) => {
        this.receipt = res;
      },
      error: (err) => {},
    });
  }

  updateTTReference(): void {
    if (!this.update.newTTRefNo.trim()) {
      this.alert.showAlert('Error', 'Please enter New TT Reference Number', 'error');
      return;
    }

    if (!this.update.remark.trim()) {
      this.alert.showAlert('Error', 'Please enter Remark', 'error');
      return;
    }

    const payload = {
      originalTTNo: this.retrieve.ttRefNo,
      newTTNo: this.update.newTTRefNo,
      remark: this.update.remark,
      transactionNo: this.receipt.transaction_no,
      userId: this.user.getUser().name,
    };

    this.ttrefService.updateTT(payload).subscribe({
      next: ({ message }: any) => {
        this.alert.showAlert('Success', message, 'success');
        this.onCancel();
      },
      error: (err) => {
        this.alert.showAlert('Error', err.error?.message || 'Something went wrong!', 'error');
      },
    });
  }

  onCancel(): void {
    this.retrieve = { ttRefNo: '' };
    this.receipt = {
      transaction_no: '',
      customer_name: '',
      reference_no: '',
      currency_code: '',
      amount: '',
      paid_invoice_total: '',
    };
    this.update = { newTTRefNo: '', remark: '' };
  }

  onUpdate(): void {
    this.updateTTReference();
  }
}
