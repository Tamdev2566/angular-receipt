import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  imports: [CommonModule, FormsModule],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.scss',
})
export class DatepickerComponent {
  @Input() value: string | null = null;
  @Output() valueChange = new EventEmitter<string | null>();

  @Input() label = '';
  @Input() placeholder = 'dd/mm/yyyy';
  @Input() disabled = false;

  @Input() helperText = '';
  @Input() required = false;
  @Input() error = false;

  isOpen = false;

  currentDate = new Date();
  selectedDate: Date | null = null;

  monthLabel = '';
  calendarDays: any[] = [];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    if (this.value) {
      const parts = this.value.split('/');
      if (parts.length === 3) {
        this.selectedDate = new Date(+parts[2], +parts[1] - 1, +parts[0]);
        this.currentDate = new Date(this.selectedDate);
      }
    }

    this.renderCalendar();
  }

  togglePicker(event?: Event): void {
    event?.stopPropagation();

    if (this.disabled) return;

    this.isOpen = !this.isOpen;
  }

  renderCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    this.monthLabel = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(this.currentDate);

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: any[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push({
        empty: true,
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        this.selectedDate &&
        this.selectedDate.getDate() === day &&
        this.selectedDate.getMonth() === month &&
        this.selectedDate.getFullYear() === year;

      days.push({
        day,
        empty: false,
        selected: isSelected,
      });
    }

    this.calendarDays = days;
  }

  changeMonth(delta: number): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + delta);
    this.currentDate = new Date(this.currentDate);
    this.renderCalendar();
  }

  selectDate(day: number): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    this.selectedDate = new Date(year, month, day);

    const formatted = this.formatDate(this.selectedDate);

    this.value = formatted;
    this.valueChange.emit(formatted);

    this.isOpen = false;

    this.renderCalendar();
  }

  clear(): void {
    this.value = null;
    this.selectedDate = null;
    this.valueChange.emit(null);
  }

  private formatDate(date: Date): string {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
