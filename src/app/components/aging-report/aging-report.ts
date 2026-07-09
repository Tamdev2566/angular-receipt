import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Combobox } from '../../shared/combobox/combobox';

@Component({
  selector: 'app-aging-report',
  standalone: true,
  imports: [CommonModule, FormsModule, Combobox],
  templateUrl: './aging-report.html',
  styleUrls: ['./aging-report.scss'],
})
export class AgingReport {
  constructor(private router: Router) {}

  loading = false;

  /* Form Model */

  formData = {
    agingDays: '',
    directoryPath: 'C:\\',
  };

  /* Aging Report Days */

  agingDayList = [
    { id: 30, name: '30 Days' },
    { id: 60, name: '60 Days' },
    { id: 90, name: '90 Days' },
    { id: 120, name: '120 Days' },
    { id: 180, name: '180 Days' },
    { id: 365, name: '365 Days' },
  ];

  /* Combobox Change */

  onAgingChange(value: any, item: any): void {
    console.log('Selected Aging Day');

    console.log(value);

    console.log(item);
  }

  /* Browse Directory */

  browseDirectory(): void {
    console.log('Browse Directory');

    // TODO:
    // Electron / Desktop folder picker integration

    alert('Directory picker will be integrated.');
  }

  /* Generate Report */

  generateReport(): void {
    if (!this.formData.agingDays) {
      alert('Please select Aging Report Days.');
      return;
    }

    if (!this.formData.directoryPath.trim()) {
      alert('Please enter Directory Path.');
      return;
    }

    const payload = {
      agingDays: this.formData.agingDays,
      directoryPath: this.formData.directoryPath,
    };

    console.log('Generate Aging Report');

    console.log(payload);

    // TODO
    // this.apiService.post(...)
  }

  /* Cancel */

  onCancel(): void {
    this.router.navigate(['/home/dashboard']);
  }
}
