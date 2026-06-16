import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../../../services/alertService/alert';

@Component({
  selector: 'app-location-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './location-modal.html',
  styleUrls: ['../shared-modal.scss'],
})
export class LocationModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  @Output() next = new EventEmitter<any[]>();

  constructor(private alertMessage: AlertService) {}

  locationSearch = '';

  currentPage = 1;

  pageSize = 5;

  locations = [
    { code: '2ASSINIE', selected: false },
    { code: 'AABENRAA', selected: false },
    { code: 'AACHEN', selected: false },
    { code: 'AALBORG', selected: false },
    { code: 'AARHUS', selected: false },
    { code: 'ABADAN', selected: false },
    { code: 'ABASHIRI, HOKKAIDO', selected: false },
    { code: 'ABAU', selected: false },
    { code: 'ABBEHAUSEN', selected: false },
    { code: 'ABBENFLETH', selected: false },
    { code: 'ABBEVILLE', selected: false },
    { code: 'ABBSE', selected: false },
    { code: 'ABEMAMA', selected: false },
    { code: 'ABENGOUROU', selected: false },
    { code: 'ABERDEEN', selected: false },
    { code: 'ABERDEEN-DYCE APT', selected: false },
  ];

  filteredLocations: any[] = [];

  ngOnInit(): void {
    this.filteredLocations = [...this.locations];
  }

  get paginatedLocations() {
    const start = (this.currentPage - 1) * this.pageSize;

    return this.filteredLocations.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredLocations.length / this.pageSize) || 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  filterLocations() {
    const search = this.locationSearch.toLowerCase();

    this.filteredLocations = this.locations.filter((x) => x.code.toLowerCase().includes(search));

    this.currentPage = 1;
  }

  closeModal() {
    this.close.emit();
  }

  proceedToOffice() {
    const selectedLocations = this.locations.filter((x) => x.selected);

    if (!selectedLocations.length) {
      this.alertMessage.showAlert('Please select at least one location', '', 'error');
      return;
    }

    this.next.emit(selectedLocations);
  }
}
