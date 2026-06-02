import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertMessage } from './shared/alert/alert';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, RouterModule, AlertMessage],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
