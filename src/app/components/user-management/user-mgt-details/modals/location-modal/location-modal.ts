import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpContext } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AlertService } from '../../../../../services/alertService/alert';
import { ApiService } from '../../../../../services/api.service';
import { UserMgtService } from '../../../user-mgt-service';
import { SKIP_LOADER } from '../../../../../core/interceptors/loaderInterceptor/loader-interceptor-interceptor';

@Component({
  selector: 'app-location-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './location-modal.html',
  styleUrls: ['../shared-modal.scss'],
})
export class LocationModalComponent implements OnInit {
  @Input() selectedLocations: any[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() next = new EventEmitter<any[]>();

  constructor(
    private alertMessage: AlertService,
    private cdr: ChangeDetectorRef,
    private userService: UserMgtService,
  ) {}

  locationSearch = '';

  currentPage = 1;
  pageSize = 10;

  totalRecords = 0;
  totalPages = 0;

  locations: any[] = [];
  filteredLocations: any[] = [];

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.loadLocations('*', 1);

    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe((term) => {
      this.loadLocations(term, 1);
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadLocations(this.locationSearch || '*', this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadLocations(this.locationSearch || '*', this.currentPage - 1);
    }
  }

  loadLocations(searchTerm: string = '*', page: number = 1): void {
    this.currentPage = page;

    this.userService.getDefaultLocations(searchTerm, page, this.pageSize).subscribe({
      next: (response: any) => {
        this.locations = response?.content || [];

        this.locations.forEach((location: any) => {
          location.selected = this.selectedLocations.some(
            (selected: any) => selected.location_id === location.location_id,
          );
        });

        this.filteredLocations = [...this.locations];

        this.totalPages = response?.totalPages || 0;
        this.totalRecords = response?.totalElements || 0;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);

        this.alertMessage.showAlert('Error', 'Failed to load locations', 'error');
      },
    });
  }

  filterLocations(): void {
    if (!this.locationSearch?.trim()) {
      this.loadLocations();
      return;
    }

    this.searchSubject.next(this.locationSearch);
  }

  closeModal() {
    this.close.emit();
  }

  proceedToOffice() {
    const selectedLocations = this.locations.filter((x) => x.selected);

    if (!selectedLocations.length) {
      this.alertMessage.showAlert('Error', 'Please select at least one location', 'error');
      return;
    }

    this.next.emit(selectedLocations);
  }

  saveLocations(): void {
    if (!this.selectedLocations.length) {
      this.alertMessage.showAlert('Error', 'Please select at least one location', 'error');
      return;
    }

    this.next.emit(this.selectedLocations);
  }

  onLocationSelectionChange(location: any): void {
    if (location.selected) {
      const exists = this.selectedLocations.some((x) => x.location_id === location.location_id);

      if (!exists) {
        this.selectedLocations.push({ ...location });
      }
    } else {
      this.selectedLocations = this.selectedLocations.filter(
        (x) => x.location_id !== location.location_id,
      );
    }
  }
}
