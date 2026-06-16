import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-office-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './office-modal.html',
  styleUrls: ['../shared-modal.scss'],
})
export class OfficeModalComponent {
  @Input() selectedLocations: any[] = [];

  @Output() close = new EventEmitter<void>();

  @Output() back = new EventEmitter<void>();

  @Output() save = new EventEmitter<any[]>();

  offices = ['SAMUDERA JAKARTA', 'PT. SAMUDERA SHIPPING SERVICES', 'PORT KLANG'];

  setDefaultOffice(index: number) {
    this.selectedLocations.forEach((x, i) => (x.isDefault = i === index));
  }

  goBack() {
    this.back.emit();
  }

  closeModal() {
    this.close.emit();
  }

  saveLocations() {
    this.save.emit(this.selectedLocations);
  }
}
