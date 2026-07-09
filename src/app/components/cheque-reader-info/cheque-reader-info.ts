import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cheque-reader-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cheque-reader-info.html',
  styleUrls: ['./cheque-reader-info.scss'],
})
export class ChequeReaderInfo {
  constructor(private router: Router) {
    this.loadCurrentDate();
  }

  /* Form Model */

  formData = {
    direction: 'BOTH',
    date: '',
    fullCheque: '',
    cheque: '',
    bank: '',
  };

  loading = false;

  /* Initialize Date */

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

  /* Save */

  onSave(): void {
    if (!this.formData.fullCheque.trim()) {
      alert('Please enter Full Cheque.');
      return;
    }

    if (!this.formData.cheque.trim()) {
      alert('Please enter Cheque.');
      return;
    }

    if (!this.formData.bank.trim()) {
      alert('Please enter Bank.');
      return;
    }

    const payload = {
      direction: this.formData.direction,
      date: this.formData.date,
      fullCheque: this.formData.fullCheque,
      cheque: this.formData.cheque,
      bank: this.formData.bank,
    };

    console.log('Cheque Reader Information');

    console.log(payload);

    // TODO
    // this.apiService.post(...)

    alert('Cheque Reader Information Saved Successfully.');
  }

  /* Cancel */

  onCancel(): void {
    this.router.navigate(['/home/dashboard']);
  }
}
