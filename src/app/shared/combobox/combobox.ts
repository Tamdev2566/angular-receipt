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
import { SKIP_LOADER } from '../../core/interceptors/loaderInterceptor/loader-interceptor-interceptor';
import { ApiService } from '../../services/api.service';

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

  @Input() extraProp: any = { placeholder: 'Select Option' };

  @Input() label = '';
  @Input() helperText = '';
  @Input() errorText = '';
  @Input() required = false;

  @Input() onChange?: (value: any, item: any) => void;
  @Input() handleChange?: (value: any, item: any) => void;
  @Input() searchFromApi: boolean = true;

  isTouched = false;

  formData = {};

  isOpen = false;
  isDataLoaded = false;
  isLoading = false;

  items: any[] = [];
  filteredItems: any[] = [];

  selectedItem: any = null;
  searchText = '';

  private isTyping = false;

  constructor(
    private http: HttpClient,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.initializeStaticData();
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
    this.isTyping = true;
    this.searchText = term;

    if (this.searchFromApi) {
      if (!term?.trim()) {
        this.loadData('*');
        return;
      }

      this.loadData(term);
    } else {
      const search = term.toLowerCase().trim();

      if (!search) {
        this.filteredItems = [...this.items];
      } else {
        this.filteredItems = this.items.filter((item) => {
          const display = (item[this.displayExpr] ?? '').toString().toLowerCase();
          return display.includes(search);
        });
      }

      this.isLoading = false;
      this.isOpen = true;
      this.isDataLoaded = true;
    }
  }

  onComboBoxInteract(): void {
    if (this.disabled) return;

    this.isOpen = true;

    if (!this.isDataLoaded) {
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

      if (!this.isTyping) {
        this.syncDisplayLabel();
      }

      this.cdr.detectChanges();
    };

    const error = () => {
      this.items = [];
      this.filteredItems = [];
      this.isLoading = false;
    };

    if (this.apiMethod === 'POST') {
      const body = {
        ...(this.requestBody || {}),
        search: searchTerm === '*' ? '' : searchTerm,
      };

      this.apiService
        .post(apiUrl, body, false, {
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
    }
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();

    if (this.disabled) return;

    this.isOpen = !this.isOpen;

    if (this.isOpen && !this.isDataLoaded) {
      this.loadData('*');
    }
  }

  selectItem(item: any, event: Event): void {
    event.stopPropagation();

    this.isTyping = false;

    this.selectedItem = item;

    this.searchText = this.codeExpr
      ? `${item[this.codeExpr]} - ${item[this.displayExpr]}`
      : item[this.displayExpr];

    const finalValue = item[this.valueExpr];

    this.value = finalValue;

    this.valueChange.emit(finalValue);

    this.onChange?.(finalValue, item);
    this.handleChange?.(finalValue, item);

    this.isOpen = false;
  }

  clearSelection(event: Event): void {
    event.stopPropagation();

    this.isTyping = false;

    this.value = null;
    this.selectedItem = null;
    this.searchText = '';

    this.valueChange.emit(null);

    this.loadData('*');
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
