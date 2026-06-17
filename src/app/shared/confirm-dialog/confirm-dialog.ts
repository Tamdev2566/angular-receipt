import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./confirm-dialog.scss'],
})
export class ConfirmDialogComponent {
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed?';

  @Output() yes = new EventEmitter<void>();
  @Output() no = new EventEmitter<void>();

  onYesClick() {
    this.yes.emit();
  }

  onNoClick() {
    this.no.emit();
  }
}
