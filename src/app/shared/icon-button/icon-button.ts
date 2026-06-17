import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  imports: [CommonModule],
  templateUrl: './icon-button.html',
  styleUrl: './icon-button.scss',
})
export class IconButton {
  iconClass = input.required<string>();
  customStyle = input<any>({});
  colorClass = input<string>('');
  title = input<string>('');
  disabled = input<boolean>(false);

  onClick = output<MouseEvent>();
}
