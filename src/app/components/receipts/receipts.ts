import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Wrapper } from '../../shared/wrapper/wrapper';
import { UndoReceiptComponent } from '../undo-receipts/undo-receipts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, Wrapper],
  templateUrl: './receipts.html',
  styleUrls: ['./receipts.scss'],
})
export class ReceiptComponent implements OnInit {
  Math = Math;
  undoReceipt = UndoReceiptComponent;
  ledgerData = [
    {
      id: 'REC-101',
      invoiceNo: 'DI23003580',
      customerName: 'PIL SHIPPING AGENCY',
      blNo: 'BL-00210',
      chequeNo: 'CHQ.8821',
      vesselName: 'KOTA RAJA',
      voyageNo: 'V.202X',
      date: '2026-06-01',
      amount: 4250.0,
      currency: 'SGD',
      payMode: 'Cheque / TT',
      status: 'Verified',
    },
    {
      id: 'REC-102',
      invoiceNo: 'DI23004192',
      customerName: 'MAERSK LINE SG',
      blNo: 'BL-11045',
      chequeNo: 'CASH',
      vesselName: 'MAERSK MC-KINNEY',
      voyageNo: 'V.405L',
      date: '2026-05-02',
      amount: 1850.0,
      currency: 'SGD',
      payMode: 'Cash',
      status: 'Unverified',
    },
    {
      id: 'REC-103',
      invoiceNo: 'DI23005501',
      customerName: 'COSCO SHIPPING CO',
      blNo: 'BL-77431',
      chequeNo: 'TT 99412',
      vesselName: 'COSCO NEBULA',
      voyageNo: 'V.102N',
      date: '2026-06-28',
      amount: 9400.0,
      currency: 'USD',
      payMode: 'Cheque / TT',
      status: 'Verified',
    },
    {
      id: 'REC-104',
      invoiceNo: 'DI23005511',
      customerName: 'ONE NETWORK EXPRESS',
      blNo: 'BL-59328',
      chequeNo: 'CASH',
      vesselName: 'ONE APUS',
      voyageNo: 'V.089W',
      date: '2026-06-03',
      amount: 520.0,
      currency: 'SGD',
      payMode: 'Cash',
      status: 'Verified',
    },
    {
      id: 'REC-105',
      invoiceNo: 'DI23003112',
      customerName: 'CMA CGM AGENCIES',
      blNo: 'BL-55412',
      chequeNo: 'CHQ 3471',
      vesselName: 'CMA CGM MARCO POLO',
      voyageNo: 'V.881S',
      date: '2026-05-15',
      amount: 12450.0,
      currency: 'SGD',
      payMode: 'Cheque / TT',
      status: 'Unverified',
    },
  ];

  filteredRecords: any[] = [];
  paginatedRecords: any[] = [];

  filterFromDate = '2026-05-01';
  filterToDate = '2026-06-30';
  filterInvoice = '';
  searchQuery = '';
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;
  totalReceiptsCount = 0;
  todaysReceiptsCount = 0;
  pendingChequesCount = 0;
  totalCollectionAmount = 0;

  activeModal: 'new' | 'undo' | 'remove' | null = null;
  selectedRecord: any = null;
  selectedIdsToRemove: string[] = [];
  toastMessage: string | null = null;

  toastVisible = false;
  toastText = '';
  showNewModal = false;
  showRemoveModal = false;
  showUndoModal = false;

  totalPagesCount = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredRecords = this.ledgerData.filter((item) => {
      let mFrom = this.filterFromDate ? new Date(item.date) >= new Date(this.filterFromDate) : true;
      let mTo = this.filterToDate ? new Date(item.date) <= new Date(this.filterToDate) : true;
      let searchKey = this.searchQuery ? this.searchQuery.toLowerCase().trim() : '';
      let mSearch = searchKey
        ? item.invoiceNo.toLowerCase().includes(searchKey) ||
          item.customerName.toLowerCase().includes(searchKey) ||
          item.vesselName.toLowerCase().includes(searchKey) ||
          item.id.toLowerCase().includes(searchKey)
        : true;

      let mInv = this.filterInvoice
        ? item.invoiceNo.toLowerCase().includes(this.filterInvoice.toLowerCase().trim())
        : true;

      return mFrom && mTo && mInv && mSearch;
    });

    this.currentPage = 1;
    this.updateMetricsCounters();
    this.calculatePagination();
  }

  updateMetricsCounters() {
    this.totalReceiptsCount = this.ledgerData.length;
    this.todaysReceiptsCount = this.ledgerData.filter((item) => item.date === '2026-06-01').length;
    this.pendingChequesCount = this.ledgerData.filter(
      (item) => item.status === 'Unverified',
    ).length;

    this.totalCollectionAmount = this.ledgerData
      .filter((item) => item.currency === 'SGD')
      .reduce((sum, item) => sum + item.amount, 0);
  }

  resetFilters() {
    this.filterFromDate = '2026-06-01';
    this.filterToDate = '2026-06-30';
    this.filterInvoice = '';
    this.searchQuery = '';
    this.applyFilters();
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredRecords.length / this.pageSize) || 1;
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedRecords = this.filteredRecords.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    this.changePage(page);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.calculatePagination();
    }
  }

  toggleSelectAllRows(event: any) {
    if (event.target.checked) {
      this.selectedIdsToRemove = this.paginatedRecords.map((r) => r.id);
    } else {
      this.selectedIdsToRemove = [];
    }
  }

  isAllRowsSelected(): boolean {
    if (this.paginatedRecords.length === 0) return false;
    return this.paginatedRecords.every((r) => this.selectedIdsToRemove.includes(r.id));
  }

  toggleRemoveSelection(id: string) {
    if (this.selectedIdsToRemove.includes(id)) {
      this.selectedIdsToRemove = this.selectedIdsToRemove.filter((item) => item !== id);
    } else {
      this.selectedIdsToRemove.push(id);
    }
  }

  openModal(type: 'new' | 'undo' | 'remove') {
    this.activeModal = type;
    if (type === 'undo') this.showUndoModal = true;
    if (type === 'remove') this.showRemoveModal = true;
  }

  openUndoModal(item: any) {
    this.selectedRecord = item;
    this.openModal('undo');
  }

  openRemoveModal(item: any) {
    this.selectedRecord = item;
    this.openModal('remove');
  }

  openNewReceiptModal() {
    this.router.navigate(['/home/new-receipt']);
  }

  closeModal() {
    this.activeModal = null;
    this.showNewModal = false;
    this.showUndoModal = false;
    this.showRemoveModal = false;
    this.selectedRecord = null;
  }

  handleSaveNewReceipt(newEntry: any) {
    this.ledgerData.unshift(newEntry);
    this.applyFilters();
    this.closeModal();
    this.triggerToast(`Successfully committed invoice trail record: ${newEntry.id}`);
  }

  handleToastNotification(msg: string) {
    this.triggerToast(msg);
  }

  handleRemoval(event: { msg: string; ids: string[] }) {
    this.ledgerData = this.ledgerData.filter((item) => !event.ids.includes(item.id));
    this.applyFilters();
    this.closeModal();
    this.triggerToast(event.msg);
  }

  triggerToast(msg: string) {
    this.toastMessage = msg;
    this.toastText = msg;
    this.toastVisible = true;
    setTimeout(() => {
      this.toastMessage = null;
      this.toastVisible = false;
    }, 4000);
  }

  onSearch(event: any): void {
    const query = event.target.value.toLowerCase();
  }
}
