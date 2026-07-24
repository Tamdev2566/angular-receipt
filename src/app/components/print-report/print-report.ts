import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from '../../shared/date-picker/date-picker';
import { Combobox } from '../../shared/combobox/combobox';

@Component({
  selector: 'app-print-report',
  standalone: true,
  imports: [CommonModule, DatepickerComponent, Combobox],
  templateUrl: './print-report.html',
  styleUrl: './print-report.scss',
})
export class PrintReport implements OnInit {
  // Current date by default bind aagum
  transactionDate: string | null = null;
  selectedPaymentMode: any = null;
  selectedCurrency: any = null;
  selectedReportFor: any = null;

  // Error flags
  transactionDateErr = false;
  paymentModeErr = false;
  currencyErr = false;
  reportForErr = false;

  paymentTypes = [
    { id: 1, name: 'Cash' },
    { id: 2, name: 'Cheque' },
    { id: 3, name: 'T/T' },
  ];

  currency = [
    { id: 1, name: 'SGD' },
    { id: 2, name: 'USD' },
  ];

  ngOnInit(): void {
    this.setCurrentDate();
  }

  private setCurrentDate(): void {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    this.transactionDate = `${day}/${month}/${year}`;
  }

  onPaymentChange(value: any, item: any): void {
    this.selectedPaymentMode = item?.name || null;
    this.paymentModeErr = !value;
    console.log('Payment Mode:', item);
  }

  onCurrencyChange(value: any, item: any): void {
    this.selectedCurrency = item?.name || null;
    this.currencyErr = !value;
    console.log('Currency:', item);
  }

  onReportForChange(value: any, item: any): void {
    this.selectedReportFor = item?.name || null;
    this.reportForErr = !value;
    console.log('Report For:', item);
  }

  onReportClick() {
    console.log('Generating Report...');
  }

  onCancel() {
    this.setCurrentDate();
    this.selectedPaymentMode = null;
    this.selectedCurrency = null;
    this.selectedReportFor = null;

    this.resetErrors();
  }

  private resetErrors() {
    this.transactionDateErr = false;
    this.paymentModeErr = false;
    this.currencyErr = false;
    this.reportForErr = false;
  }

  retrieveReport() {
    this.transactionDateErr = !this.transactionDate;
    this.paymentModeErr = !this.selectedPaymentMode;
    this.currencyErr = !this.selectedCurrency;
    this.reportForErr = !this.selectedReportFor;

    if (this.transactionDateErr || this.paymentModeErr || this.currencyErr || this.reportForErr) {
      return;
    }

    console.log('Fetching records for:', {
      transactionDate: this.transactionDate,
      paymentMode: this.selectedPaymentMode,
      currency: this.selectedCurrency,
      reportFor: this.selectedReportFor,
    });
  }
}
