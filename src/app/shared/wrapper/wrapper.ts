import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, input, output, Type } from '@angular/core';

@Component({
  selector: 'app-wrapper',
  imports: [CommonModule, NgComponentOutlet],
  templateUrl: './wrapper.html',
  styleUrl: './wrapper.scss',
})
export class Wrapper {
  title = input<string>('');
  wrapperClass = input<string>('shadow-sm');
  dynamicComponent = input.required<Type<any>>();
  componentInputs = input<Record<string, unknown>>({});
  isModal = input<boolean>(false);
  onClose = output<void>();

  closeModal() {
    this.onClose.emit();
  }
}
