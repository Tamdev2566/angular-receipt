import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ModuleService } from '../../../services/module-service/module-service';
import { SummaryCard } from '../../../shared/summary-card/summary-card';
import { Wrapper } from '../../../shared/wrapper/wrapper';
import { LoaderService } from '../../../services/loaderService/loader-service';
import { RemoveInvoiceDetails } from '../../remove-invoice/remove-invoice-details/remove-invoice-details';
import { UndoPaymentDetails } from '../../undo-payments/undo-payment-details/undo-payment-details';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, Wrapper, SummaryCard],
  templateUrl: './receipts.html',
  styleUrls: ['./receipts.scss'],
})
export class ReceiptComponent {
  undoReceipt = UndoPaymentDetails;
  removeReceipt = RemoveInvoiceDetails;

  showUndoModal = false;

  showRemoveModal = false;

  selectedRecord: any = null;

  toastMessage: string | null = null;

  searchQuery = '';

  filteredReceipts: any[] = [];

  receipts: any[] = [];

  constructor(
    private router: Router,
    private stateService: ModuleService,
    private loader: LoaderService,
  ) {}

  ngOnInit() {
    this.loader.isLoading.set(true);
    setTimeout(() => {
      this.loader.isLoading.set(false);

      this.receipts = [
        {
          id: 'REC-101',
          invoiceNo: 'DI23003580',
          customerName: 'CUSTOMER ENTITY NAME LTD',
          blNo: 'BL-SNG-4451',
          chequeNo: 'CASH',
          vesselName: 'SINAR AMBON',
          voyageNo: 'TESTVGM2',
          date: '2026-05-15',
          amount: 2166.35,
          currency: 'SGD',
          payMode: 'Cash',
        },
        {
          id: 'REC-102',
          invoiceNo: 'DI23004491',
          customerName: 'GLO-BRIDGE CARRIERS PTE',
          blNo: 'BL-NOL-8891',
          chequeNo: 'CHQ-DB-29930',
          vesselName: 'MAERSK MC-KINNEY MOLLER',
          voyageNo: 'V-2619N',
          date: '2026-05-12',
          amount: 8450,
          currency: 'USD',
          payMode: 'Cheque / TT',
        },
        {
          id: 'REC-103',
          invoiceNo: 'DI23009982',
          customerName: 'PACIFIC HARBOR FREIGHTERS',
          blNo: 'BL-APL-1290',
          chequeNo: 'CHQ-CITI-44512',
          vesselName: 'APL VANGUARD',
          voyageNo: 'V-002E',
          date: '2026-05-16',
          amount: 14200,
          currency: 'SGD',
          payMode: 'Cheque / TT',
        },
        {
          id: 'REC-104',
          invoiceNo: 'DI23001229',
          customerName: 'TRIDENT FREIGHT SERVICES',
          blNo: 'BL-COSCO-5512',
          chequeNo: 'CASH',
          vesselName: 'COSCO ENGLAND',
          voyageNo: 'V-5511',
          date: '2026-05-18',
          amount: 980,
          currency: 'SGD',
          payMode: 'Cash',
        },
        {
          id: 'REC-105',
          invoiceNo: 'DI23005510',
          customerName: 'OCEANIC ALLIANCE CO',
          blNo: 'BL-SNG-4462',
          chequeNo: 'CASH',
          vesselName: 'SINAR AMBON',
          voyageNo: 'TESTVGM2',
          date: '2026-05-14',
          amount: 5120,
          currency: 'SGD',
          payMode: 'Cash',
        },
        {
          id: 'REC-106',
          invoiceNo: 'DI23007781',
          customerName: 'GLOBAL LOGISTICS INC',
          blNo: 'BL-SNG-9981',
          chequeNo: 'CHQ-CITI-22314',
          vesselName: 'MAERSK MC-KINNEY MOLLER',
          voyageNo: 'V-2619N',
          date: '2026-05-13',
          amount: 12350,
          currency: 'USD',
          payMode: 'Cheque / TT',
        },
        {
          id: 'REC-107',
          invoiceNo: 'DI23007781',
          customerName: 'GLOBAL LOGISTICS INC',
          blNo: 'BL-SNG-9981',
          chequeNo: 'CHQ-CITI-22314',
          vesselName: 'MAERSK MC-KINNEY MOLLER',
          voyageNo: 'V-2619N',
          date: '2026-05-13',
          amount: 12350,
          currency: 'USD',
          payMode: 'Cheque / TT',
        },
        {
          id: 'REC-108',
          invoiceNo: 'DI23007781',
          customerName: 'GLOBAL LOGISTICS INC',
          blNo: 'BL-SNG-9981',
          chequeNo: 'CHQ-CITI-22314',
          vesselName: 'MAERSK MC-KINNEY MOLLER',
          voyageNo: 'V-2619N',
          date: '2026-05-13',
          amount: 12350,
          currency: 'USD',
          payMode: 'Cheque / TT',
        },
        {
          id: 'REC-109',
          invoiceNo: 'DI23007781',
          customerName: 'GLOBAL LOGISTICS INC',
          blNo: 'BL-SNG-9981',
          chequeNo: 'CHQ-CITI-22314',
          vesselName: 'MAERSK MC-KINNEY MOLLER',
          voyageNo: 'V-2619N',
          date: '2026-05-13',
          amount: 12350,
          currency: 'USD',
          payMode: 'Cheque / TT',
        },
        {
          id: 'REC-110',
          invoiceNo: 'DI23007781',
          customerName: 'GLOBAL LOGISTICS INC',
          blNo: 'BL-SNG-9981',
          chequeNo: 'CHQ-CITI-22314',
          vesselName: 'MAERSK MC-KINNEY MOLLER',
          voyageNo: 'V-2619N',
          date: '2026-05-13',
          amount: 12350,
          currency: 'USD',
          payMode: 'Cheque / TT',
        },
      ];
      this.filteredReceipts = [...this.receipts];
    }, 2000);
  }

  onCreateClick() {
    this.router.navigate(['/home/new-receipt']);
  }

  onUpdateClick() {
    this.router.navigate(['/home/new-receipt']);
  }

  onPrintClick() {
    console.log('Print Button Triggered');
  }

  onClickHistory() {
    console.log('History Button Triggered');
  }

  onSearch(value?: any): void {
    const query = this.searchQuery.toLowerCase().trim() || value.toLowerCase().trim();

    if (!query) {
      this.filteredReceipts = [...this.receipts];
      return;
    }

    this.filteredReceipts = this.receipts.filter(
      (item) =>
        item.invoiceNo.toLowerCase().includes(query) ||
        item.customerName.toLowerCase().includes(query) ||
        item.vesselName.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query),
    );
  }

  openUndoModal(item: any) {
    this.selectedRecord = item;
    this.showUndoModal = true;
    this.stateService.setModalState(true);
  }

  openRemoveModal(item: any) {
    this.selectedRecord = item;
    this.showRemoveModal = true;
    this.stateService.setModalState(true);
  }

  closeModal() {
    this.showUndoModal = false;
    this.showRemoveModal = false;
    this.selectedRecord = null;
    this.stateService.setModalState(false);
  }

  triggerToast(msg: string) {
    this.toastMessage = msg;

    setTimeout(() => {
      this.toastMessage = null;
    }, 4000);
  }
}
