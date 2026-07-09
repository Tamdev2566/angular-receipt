import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatepickerComponent } from '../../shared/date-picker/date-picker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-undo-cheque-reader-report',
  imports: [CommonModule, FormsModule, DatepickerComponent],
  templateUrl: './undo-cheque-reader-report.html',
  styleUrl: './undo-cheque-reader-report.scss',
})
export class UndoChequeReaderReport {
  constructor(private router: Router) {
    const today = new Date().toISOString().split('T')[0];

    this.reportForm.fromDate = today;
    this.reportForm.toDate = today;
  }

  reportForm = {
    fromDate: '',
    toDate: '',
    directoryPath: 'C:\\',
  };

  loading = false;

  browseDirectory(): void {
    console.log('Browse Folder');
  }

  generateReport(): void {
    if (!this.reportForm.fromDate) {
      alert('Please select From Date');
      return;
    }

    if (!this.reportForm.toDate) {
      alert('Please select To Date');
      return;
    }

    if (!this.reportForm.directoryPath.trim()) {
      alert('Please select Directory Path');
      return;
    }

    const payload = {
      fromDate: this.reportForm.fromDate,
      toDate: this.reportForm.toDate,
      directoryPath: this.reportForm.directoryPath,
    };

    console.log('Updated Cheque Report Payload');
    console.log(payload);

    // TODO: Call API
  }

  onGenerate(): void {
    this.generateReport();
  }

  onCancel(): void {
    this.router.navigate(['/home/dashboard']);
  }
}
