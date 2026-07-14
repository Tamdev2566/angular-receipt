import { CommonModule } from '@angular/common';
import { HttpClient, HttpContext } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SKIP_LOADER } from '../../core/interceptors/loaderInterceptor/loader-interceptor-interceptor';
import { ApiService } from '../../services/api.service';

export interface ComboboxSelection {
  value: any;
  item: any | null;
}

@Component({
  selector: 'app-combobox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './combobox.html',
  styleUrls: ['./combobox.scss'],
})
export class Combobox implements OnInit, OnChanges {
  @Input() url?: string;
  @Input() apiMethod: 'GET' | 'POST' = 'GET';
  @Input() requestBody: any = null;
  @Input() responsePath: string = 'content';

  @Input() codeExpr: string = '';
  @Input() displayExpr: string = 'name';
  @Input() valueExpr: string = 'id';

  @Input() data: any[] = [];
  @Input() options: any[] = [];
  @Input() disabled = false;

  @Input() value: any = null;
  @Output() valueChange = new EventEmitter<any>();
  /** Emits both valueExpr and the complete selected item, including displayExpr fields. */
  @Output() selectionChange = new EventEmitter<ComboboxSelection>();

  @Input() extraProp: any = { placeholder: 'Select Option' };

  @Input() label = '';
  @Input() helperText = '';
  @Input() errorText = '';
  @Input() required = false;

  @Input() onChange?: (value: any, item: any) => void;
  @Input() handleChange?: (value: any, item: any) => void;
  @Input() searchFromApi: boolean = true;
  @Input() name = '';
  @Input() reload: boolean = false;

  isTouched = false;
  formData = {};
  isOpen = false;
  isDataLoaded = false;
  isLoading = false;

  items: any[] = [];
  filteredItems: any[] = [];
  selectedItem: any = null;
  searchText = '';

  // Safe feature addition: Track active keyboard highlight index
  activeIndex = -1;

  private isTyping = false;
  private suppressSearch = false;
  private searchSubject = new Subject<string>();

  constructor(
    private http: HttpClient,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.initializeStaticData();

    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
      this.loadData(value || '*');
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] || changes['data'] || changes['options']) {
      if (!this.url) {
        this.initializeStaticData();
      } else {
        this.syncDisplayLabel();
      }
    }
  }

  private initializeStaticData(): void {
    if (!this.url) {
      const source = this.data?.length ? this.data : this.options;

      this.items = Array.isArray(source) ? [...source] : [];
      this.filteredItems = [...this.items];

      this.isDataLoaded = true;
      this.syncDisplayLabel();
    }
  }

  onBlur(): void {
    this.isTouched = true;
  }

  onSearchInput(term: string): void {
    if (this.suppressSearch) {
      this.suppressSearch = false;
      return;
    }

    this.isTyping = true;
    this.searchText = term;
    this.activeIndex = -1; // Reset selection index on new search string

    if (this.searchFromApi) {
      this.searchSubject.next(term?.trim() || '*');
      return;
    }

    const search = term.toLowerCase().trim();

    this.filteredItems = !search
      ? [...this.items]
      : this.items.filter((item) =>
          (item[this.displayExpr] ?? '').toString().toLowerCase().includes(search),
        );

    this.isLoading = false;
    this.isOpen = true;
  }

  onComboBoxInteract(): void {
    if (this.disabled) return;

    this.isOpen = true;

    // If reload is true, force load every time.
    // If reload is false, only load if data hasn't been fetched yet.
    if (this.reload || !this.isDataLoaded) {
      this.loadData('*');
    }
  }

  loadData(searchTerm: string = '*'): void {
    if (!this.url) return;

    this.isLoading = true;
    let apiUrl = this.url;

    if (searchTerm !== '*') {
      apiUrl = this.url.replace('*/*/1/100', `*/${searchTerm}/1/100`);
    }

    const success = (response: any) => {
      let result = response;

      if (this.responsePath?.trim() && result) {
        const paths = this.responsePath.split('.');

        for (const path of paths) {
          result = result?.[path];
        }
      }

      this.items = Array.isArray(result) ? [...result] : [];
      this.filteredItems = [...this.items];

      this.isLoading = false;
      this.isOpen = true;
      this.isDataLoaded = true;
      this.activeIndex = -1; // Clear highlight status post-fetch

      if (!this.isTyping) {
        this.syncDisplayLabel();
      }

      this.cdr.detectChanges();
    };

    const error = () => {
      this.items = [];
      this.filteredItems = [];
      this.isLoading = false;
      this.cdr.detectChanges();
    };

    if (this.apiMethod === 'POST') {
      const body = {
        ...(this.requestBody || {}),
        search: searchTerm === '*' ? '' : searchTerm,
      };

      this.apiService
        .post(apiUrl, body, {
          context: new HttpContext().set(SKIP_LOADER, true),
        })
        .subscribe({
          next: success,
          error,
        });
    } else {
      this.apiService
        .get(apiUrl, {
          context: new HttpContext().set(SKIP_LOADER, true),
        })
        .subscribe({
          next: success,
          error,
        });
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }

  private syncDisplayLabel(): void {
    const lookupPool = Array.isArray(this.items) ? this.items : [];

    if (this.value === null || this.value === undefined) {
      this.selectedItem = null;
      this.searchText = '';
      return;
    }

    const match = lookupPool.find((item) => item && item[this.valueExpr] === this.value);

    if (match) {
      this.selectedItem = match;

      this.searchText = this.codeExpr
        ? `${match[this.codeExpr]} - ${match[this.displayExpr]}`
        : match[this.displayExpr];

      return;
    }

    if (typeof this.value === 'object') {
      this.searchText = this.getNestedValue(this.value, this.displayExpr) || '';
      return;
    }
    if (this.url && lookupPool.length === 0 && !this.isDataLoaded && !this.isLoading) {
      this.loadData(this.value);
    }
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();

    if (this.disabled) return;

    this.isOpen = !this.isOpen;

    // Same rule applied here for manual arrow clicks
    if (this.isOpen && (this.reload || !this.isDataLoaded)) {
      this.loadData('*');
    }
  }

  selectItem(item: any, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    this.isTyping = false;
    this.selectedItem = item;
    this.suppressSearch = true;

    this.searchText = this.codeExpr
      ? `${item[this.codeExpr]} - ${item[this.displayExpr]}`
      : item[this.displayExpr];

    const finalValue = item[this.valueExpr];
    this.value = finalValue;

    this.valueChange.emit(finalValue);
    this.selectionChange.emit({ value: finalValue, item });

    this.onChange?.(finalValue, item);
    this.handleChange?.(finalValue, item);

    this.isOpen = false;
  }

  clearSelection(event: Event): void {
    event.stopPropagation();

    this.value = null;
    this.selectedItem = null;
    this.searchText = '';
    this.activeIndex = -1;

    this.valueChange.emit(null);
    this.selectionChange.emit({ value: null, item: null });

    this.onChange?.(null, null);
    this.handleChange?.(null, null);

    if (this.searchFromApi) {
      this.searchSubject.next('*');
    } else {
      this.filteredItems = [...this.items];
    }
  }

  // Safe new feature: Isolated keyboard management hook
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.isOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        if (this.filteredItems.length > 0) {
          this.activeIndex = (this.activeIndex + 1) % this.filteredItems.length;
          this.scrollActiveItemIntoView();
        }
        event.preventDefault();
        break;
      case 'ArrowUp':
        if (this.filteredItems.length > 0) {
          this.activeIndex =
            (this.activeIndex - 1 + this.filteredItems.length) % this.filteredItems.length;
          this.scrollActiveItemIntoView();
        }
        event.preventDefault();
        break;
      case 'Enter':
        if (this.activeIndex >= 0 && this.activeIndex < this.filteredItems.length) {
          this.selectItem(this.filteredItems[this.activeIndex]);
        }
        event.preventDefault();
        break;
      case 'Escape':
      case 'Tab':
        this.isOpen = false;
        this.cdr.markForCheck();
        break;
    }
  }

  private scrollActiveItemIntoView(): void {
    setTimeout(() => {
      const activeEl = this.elementRef.nativeElement.querySelector('.combobox-item.active');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
