import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReceiptItem, reportPrint } from '../../report-template/reportPrint';
import { ApiService } from '../../services/api.service';
import { MenuAccessService } from '../../services/menu-access';
import { Combobox } from '../../shared/combobox/combobox';
import { DatepickerComponent } from '../../shared/date-picker/date-picker';
import { HtmlViewer } from '../../shared/html-viewer/html-viewer';

@Component({
  selector: 'app-print-report',
  standalone: true,
  imports: [CommonModule, DatepickerComponent, Combobox, HtmlViewer],
  templateUrl: './print-report.html',
  styleUrl: './print-report.scss',
})
export class PrintReport implements OnInit {
  transactionDate: string | null = null;
  selectedPaymentMode: any = null;
  selectedCurrency: any = null;
  selectedReportFor: any = null;

  paymentModeId: any = null;
  currencyId: any = null;
  reportForId: any = null;

  formattedDate: string = '';

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

  htmlTemplate: string = '';
  isModalOpen: boolean = false;

  constructor(
    private apiService: ApiService,
    private menuAccessService: MenuAccessService,
    private router: Router,
  ) {}

  get isAllowed(): boolean {
    return this.menuAccessService.currentPermission().fullAccess;
  }

  ngOnInit(): void {
    this.setCurrentDate();
    this.menuAccessService.checkPermissionForUrl(this.router.url);
  }

  private setCurrentDate(): void {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    const formattedToday = `${day}/${month}/${year}`;
    this.transactionDate = formattedToday;
    this.formattedDate = formattedToday;
  }

  private formatForApi(dateStr: string | null): string {
    if (!dateStr || !dateStr.includes('/')) return dateStr || '';
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }

  onPaymentChange(value: any, item: any): void {
    this.selectedPaymentMode = item?.name || null;
    this.paymentModeErr = !value;
  }

  onCurrencyChange(value: any, item: any): void {
    this.selectedCurrency = item?.name || null;
    this.currencyErr = !value;
  }

  onReportForChange(value: any, item: any): void {
    this.selectedReportFor = item?.userName || null;
    this.reportForErr = !value;
  }

  onCancel(): void {
    this.setCurrentDate();

    this.selectedPaymentMode = null;
    this.selectedCurrency = null;
    this.selectedReportFor = null;

    this.paymentModeId = null;
    this.currencyId = null;
    this.reportForId = null;

    this.resetErrors();
  }

  private resetErrors(): void {
    this.transactionDateErr = false;
    this.paymentModeErr = false;
    this.currencyErr = false;
    this.reportForErr = false;
  }

  onModalClose(data: boolean) {
    this.isModalOpen = data;
  }

  retrieveReport(): void {
    this.transactionDateErr = !this.transactionDate;
    this.paymentModeErr = !this.selectedPaymentMode;
    this.currencyErr = !this.selectedCurrency;
    this.reportForErr = !this.selectedReportFor;

    if (this.transactionDateErr || this.paymentModeErr || this.currencyErr || this.reportForErr) {
      return;
    }

    const payload = {
      transactionDate: this.formatForApi(this.transactionDate),
      paymentMode: this.selectedPaymentMode,
      currency: this.selectedCurrency,
      reportFor: this.selectedReportFor,
    };

    this.apiService.post('api/receipts/getReports', payload).subscribe({
      next: (res: any) => {
        if (res && (Array.isArray(res) ? res.length > 0 : true)) {
          const rawList = Array.isArray(res) ? res : res?.details || [];

          const parseAmount = (val: any): number => {
            if (val === null || val === undefined) return 0;
            const num = typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : Number(val);
            return isNaN(num) ? 0 : num;
          };

          const mappedDetails: ReceiptItem[] = rawList.map((item: any, index: number) => ({
            seqNo: index + 1,
            transactionNo: item.transactionNo || 'N/A',
            customerName: item.customer || 'N/A',
            description: `Ref: ${item.referenceNo || 'N/A'} | Bank: ${item.bank || 'N/A'}`,
            currency: item.currencyCode || this.selectedCurrency || 'SGD',
            amount: parseAmount(item.amount).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
          }));

          const totalAmount = rawList.reduce((acc: number, item: any) => {
            return acc + parseAmount(item.amount);
          }, 0);

          const formattedTotal = totalAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          const firstItem = rawList[0] || {};

          this.htmlTemplate = reportPrint({
            receiptNo: firstItem.transactionNo || '',
            txtTitle: 'OFFICIAL PAYMENT RECEIPT',
            receiptDate: this.transactionDate || firstItem.receiptDate || '',
            paymentMethod: firstItem.paymentMode,
            customerName: firstItem.customer || '',
            customerAddress: res?.customerAddress || '',
            txtUserID: firstItem.createdUser || this.selectedReportFor,
            txtTotal: formattedTotal,
            details: mappedDetails,
          });

          this.isModalOpen = true;
        } else {
          console.warn('No records returned from API');
        }
      },
      error: (err) => {
        console.error('Failed to retrieve report:', err);
      },
    });
  }
}
