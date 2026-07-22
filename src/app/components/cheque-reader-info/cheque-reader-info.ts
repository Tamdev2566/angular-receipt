import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/userService/user.service';
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alertService/alert';

@Component({
  selector: 'app-cheque-reader-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cheque-reader-info.html',
  styleUrls: ['./cheque-reader-info.scss'],
})
export class ChequeReaderInfo {
  constructor(
    private router: Router,
    private userService: UserService,
    private apiService: ApiService,
    private alert: AlertService,
  ) {
    this.loadCurrentDate();
  }

  formData = {
    direction: 'INBOUND',
    date: '',
    fullCheque: '',
    cheque: '',
    bank: '',
  };

  errors: { [key: string]: boolean } = {};
  isSubmitted = false;

  validateFullCheque(): void {
    if (this.formData.fullCheque?.trim()) {
      this.errors['fullCheque'] = false;
    } else {
      this.errors['fullCheque'] = true;
    }
  }

  loadCurrentDate(): void {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const hh = String(hours).padStart(2, '0');

    this.formData.date = `${day}-${month}-${year} ${hh}:${minutes}:${seconds} ${ampm}`;
  }

  onSave(): void {
    this.isSubmitted = true;
    this.validateFullCheque();

    if (this.errors['fullCheque']) {
      return;
    }

    const user = this.userService.getUser();

    const payload = {
      boundOption:
        this.formData.direction === 'INBOUND'
          ? 'I'
          : this.formData.direction === 'OUTBOUND'
            ? 'O'
            : 'IO',
      date: this.formData.date,
      fullChequeNo: this.formData.fullCheque,
      chequeNo: this.formData.cheque,
      bank: this.formData.bank,
      uid: user.name,
    };

    this.apiService.post('api/cheque/save', payload).subscribe({
      next: (res: any) => {
        this.alert.showAlert('Success', res.message, 'success');
        this.onCancel();
      },
      error: (err) => {
        this.alert.showAlert('Error', err.error.message, 'error');
      },
    });
  }

  onCancel(): void {
    this.isSubmitted = false;
    this.errors = {};
    this.formData = {
      direction: 'INBOUND',
      date: '',
      fullCheque: '',
      cheque: '',
      bank: '',
    };
  }
}
