import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-remove-receipt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './remove-receipts.html',
})
export class RemoveReceiptComponent implements OnInit {
  @Input() record: any;
  @Input() allRecords: any[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<{ msg: string; ids: string[] }>();
  @Output() toast = new EventEmitter<string>();

  inputCustomer = '';
  inputVessel = '';
  inputVoyage = '';
  removalRemark = '';

  matches: any[] = [];
  selectedIds: string[] = [];

  ngOnInit() {
    if (this.record) {
      this.inputCustomer = this.record.customerName;
      this.inputVessel = this.record.vesselName;
      this.inputVoyage = this.record.voyageNo;
      this.matches = [this.record];
      this.selectedIds = [this.record.id];
    }

    document.body.classList.add('receipt-open');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('receipt-open');
  }

  retrieveRemoveModalData() {
    this.matches = this.allRecords.filter(
      (item) =>
        (this.inputCustomer &&
          item.customerName.toLowerCase().includes(this.inputCustomer.toLowerCase())) ||
        (this.inputVessel &&
          item.vesselName.toLowerCase().includes(this.inputVessel.toLowerCase())) ||
        (this.inputVoyage && item.voyageNo.toLowerCase().includes(this.inputVoyage.toLowerCase())),
    );
    this.toast.emit(`Found ${this.matches.length} matching candidate records.`);
  }

  toggleSelection(id: string) {
    const idx = this.selectedIds.indexOf(id);
    if (idx > -1) {
      this.selectedIds.splice(idx, 1);
    } else {
      this.selectedIds.push(id);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedIds.includes(id);
  }

  commitRemove() {
    if (!this.removalRemark.trim()) {
      this.toast.emit('Validation Error: Reason/Remark is mandatory for invoice deletion.');
      return;
    }
    if (this.selectedIds.length === 0) {
      this.toast.emit('Please select at least one invoice to remove.');
      return;
    }

    this.success.emit({
      msg: `Removed ${this.selectedIds.length} record(s) | Reason: "${this.removalRemark}"`,
      ids: this.selectedIds,
    });
    this.close.emit();
  }

  onClose() {
    document.body.classList.remove('receipt-open');
    this.close.emit();
  }
}
