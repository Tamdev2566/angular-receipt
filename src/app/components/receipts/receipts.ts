import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UndoReceiptComponent } from '../undo-receipts/undo-receipts';
import { RemoveReceiptComponent } from '../remove-receipts/remove-receipts';
import { NewReceiptComponent } from '../new-receipts/new-receipts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UndoReceiptComponent,
    RemoveReceiptComponent,
    NewReceiptComponent,
  ],
  templateUrl: './receipts.html',
  styles: [
    `
      .tracking-tight {
        letter-spacing: -0.025em;
      }
      .border-slate {
        border-color: #dee2e6 !important;
      }
      .form-control:focus,
      .form-select:focus {
        border-color: #5e72e4 !important;
        box-shadow:
          0 3px 9px rgba(50, 50, 93, 0.05),
          0 1px 3px rgba(0, 0, 0, 0.08);
      }
      .transition-card {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .transition-card:hover {
        transform: translateY(-4px);
        box-shadow:
          0 7px 14px rgba(50, 50, 93, 0.1),
          0 3px 6px rgba(0, 0, 0, 0.08) !important;
      }
      .page-link {
        color: #525f7f;
        background-color: #fff;
        border: 1px solid #dee2e6;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        gap: 2px;
      }
      .page-link.active-page {
        background-color: #2dce89 !important;
        border-color: #2dce89 !important;
        color: white !important;
        box-shadow:
          0 4px 6px rgba(50, 50, 93, 0.11),
          0 1px 3px rgba(0, 0, 0, 0.08) !important;
      }
      .page-link:hover:not(.active-page) {
        background-color: #f6f9fc !important;
        border-color: #cbd5e1 !important;
      }
      .max-w-160 {
        max-width: 160px;
      }
      .border-dashed {
        border-style: dashed !important;
      }
      .animate-toast {
        animation: slideUp 0.3s ease-out;
      }
      @keyframes slideUp {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .modal-open-active aside,
      .modal-open-active .sidebar,
      .modal-open-active [class*='sidebar'] {
        filter: blur(8px) !important;
        transition: filter 0.25s ease-in-out;
      }
    `,
  ],
})
export class ReceiptComponent implements OnInit {
  Math = Math;

  ledgerData = [
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
      status: 'Unverified',
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
      amount: 8450.0,
      currency: 'USD',
      payMode: 'Cheque / TT',
      status: 'Verified',
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
      amount: 14200.0,
      currency: 'SGD',
      payMode: 'Cheque / TT',
      status: 'Unverified',
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
      amount: 980.0,
      currency: 'SGD',
      payMode: 'Cash',
      status: 'Verified',
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
      amount: 5120.0,
      currency: 'SGD',
      payMode: 'Cash',
      status: 'Verified',
    },
  ];

  filteredRecords: any[] = [];
  paginatedRecords: any[] = [];

  filterFromDate = '2026-05-01';
  filterToDate = '2026-05-20';
  filterInvoice = '';

  currentPage = 1;
  pageSize = 6;
  totalPages = 1;

  showUndoModal = false;
  showRemoveModal = false;
  showNewModal = false;
  selectedRecord: any = null;

  toastVisible = false;
  toastText = '';

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredRecords = this.ledgerData.filter((item) => {
      let mFrom = this.filterFromDate ? new Date(item.date) >= new Date(this.filterFromDate) : true;
      let mTo = this.filterToDate ? new Date(item.date) <= new Date(this.filterToDate) : true;
      let mInv = this.filterInvoice
        ? item.invoiceNo.toLowerCase().includes(this.filterInvoice.toLowerCase().trim())
        : true;
      return mFrom && mTo && mInv;
    });

    this.currentPage = 1;
    this.calculatePagination();
    // this.triggerToast('Ledger query filters applied.');
  }

  resetFilters() {
    this.filterFromDate = '2026-05-01';
    this.filterToDate = '2026-05-20';
    this.filterInvoice = '';
    this.applyFilters();
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredRecords.length / this.pageSize) || 1;
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedRecords = this.filteredRecords.slice(start, start + this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.calculatePagination();
    }
  }

  openUndoModal(item: any) {
    this.selectedRecord = item;
    this.showUndoModal = true;
  }

  openRemoveModal(item: any) {
    this.selectedRecord = item;
    this.showRemoveModal = true;
  }

  openNewReceiptModal() {
    this.showNewModal = true;
    // this.triggerToast('Create Outward Cargo form initialization triggered.');
  }

  handleSaveNewReceipt(newEntry: any) {
    this.ledgerData.unshift(newEntry);
    this.applyFilters();
    // this.triggerToast(`New Invoice Registry created successfully: ${newEntry.id}`);
  }

  handleToastNotification(msg: string) {
    // this.triggerToast(msg);
  }

  handleRemoval(event: { msg: string; ids: string[] }) {
    this.ledgerData = this.ledgerData.filter((item) => !event.ids.includes(item.id));
    this.applyFilters();
    // this.triggerToast(event.msg);
  }

  // triggerToast(msg: string) {
  //   this.toastText = msg;
  //   this.toastVisible = true;
  //   setTimeout(() => (this.toastVisible = false), 4000);
  // }
}
