import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoaderService } from './services/loaderService/loader-service';
import { AlertMessage } from './shared/alert/alert';
import { LoaderComponent } from './shared/loader/loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, RouterModule, AlertMessage, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  loaderService = inject(LoaderService);
}
