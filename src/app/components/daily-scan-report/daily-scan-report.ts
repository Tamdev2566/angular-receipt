import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatepickerComponent } from '../../shared/date-picker/date-picker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cheque-reader-report',
  standalone: true,
  imports: [CommonModule, FormsModule, DatepickerComponent],
  templateUrl: './daily-scan-report.html',
  styleUrl: './daily-scan-report.scss',
})
export class DailyScanReport {
  constructor(private router: Router) {
    this.setDefaultDates();
  }

  loading = false;

  /* Form Model */

  formData = {
    readerType: 'OUTBOUND',
    fromDate: '',
    toDate: '',
    directoryPath: 'C:\\',
  };

  /* Default Date */

  setDefaultDates(): void {
    const today = new Date().toISOString().split('T')[0];

    this.formData.fromDate = today;
    this.formData.toDate = today;
  }

  /* Browse Directory */

  browseDirectory(): void {
    console.log('Browse Directory');

    // TODO:
    // Electron / Folder Picker Integration

    alert('Directory picker will be integrated.');
  }

  /* Generate Report */

  generateReport(): void {
    if (!this.formData.fromDate) {
      alert('Please select From Date.');
      return;
    }

    if (!this.formData.toDate) {
      alert('Please select To Date.');
      return;
    }

    if (!this.formData.directoryPath.trim()) {
      alert('Please select Directory Path.');
      return;
    }

    const payload = {
      readerType: this.formData.readerType,
      fromDate: this.formData.fromDate,
      toDate: this.formData.toDate,
      directoryPath: this.formData.directoryPath,
    };

    console.log('Cheque Reader Report');

    console.log(payload);

    // TODO
    // this.apiService.post(...)
  }

  /* Cancel */

  onCancel(): void {
    this.router.navigate(['/home/dashboard']);
  }
}
