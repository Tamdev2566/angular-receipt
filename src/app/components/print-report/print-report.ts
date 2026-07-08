import { Component } from '@angular/core';
import { DatepickerComponent } from '../../shared/date-picker/date-picker';
import { Combobox } from '../../shared/combobox/combobox';

@Component({
  selector: 'app-print-report',
  imports: [DatepickerComponent, Combobox],
  templateUrl: './print-report.html',
  styleUrl: './print-report.scss',
})
export class PrintReport {
  paymentTypes = [
    { id: 1, name: 'Cash' },
    { id: 2, name: 'Cheque' },
    { id: 3, name: 'T/T' },
  ];
  currency = [
    { id: 1, name: 'SGD' },
    { id: 2, name: 'USD' },
  ];

  onPaymentChange(value: any, item: any): void {
    console.log(item);
  }
  onCurrencyChange(value: any, item: any): void {
    console.log(item);
  }
  onReportClick() {}
  onCancel() {}
  retrieveReport() {}
}
