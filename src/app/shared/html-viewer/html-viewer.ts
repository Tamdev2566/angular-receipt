import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-html-viewer',
  standalone: true,
  imports: [],
  templateUrl: './html-viewer.html',
  styleUrl: './html-viewer.scss',
})
export class HtmlViewer implements OnChanges, AfterViewInit {
  @Input() htmlCode: string = '';
  @Input() isOpen: boolean = false;

  @Output() isOpenChange = new EventEmitter<boolean>();

  @ViewChild('iframeRef') iframeRef!: ElementRef<HTMLIFrameElement>;
  @ViewChild('modalRef') modalRef!: ElementRef<HTMLDivElement>;

  private modalInstance: any;

  ngAfterViewInit(): void {
    if (this.isOpen) {
      this.openModal();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (this.isOpen) {
        this.openModal();
      } else {
        this.closeModal();
      }
    }

    if (changes['htmlCode'] && this.isOpen) {
      this.renderHtml();
    }
  }

  private openModal(): void {
    setTimeout(() => {
      if (this.modalRef?.nativeElement) {
        document.body.appendChild(this.modalRef.nativeElement);

        if (!this.modalInstance) {
          this.modalInstance = new bootstrap.Modal(this.modalRef.nativeElement, {
            backdrop: true,
            keyboard: false,
          });

          this.modalRef.nativeElement.addEventListener('hidden.bs.modal', () => {
            this.isOpen = false;
            this.isOpenChange.emit(false);
          });
        }

        this.renderHtml();
        this.modalInstance.show();
      }
    }, 100);
  }

  closeModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }

  private renderHtml(): void {
    setTimeout(() => {
      const iframe = this.iframeRef?.nativeElement;
      if (iframe) {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(this.htmlCode || '');
          doc.close();
        }
      }
    }, 100);
  }

  printDocument(): void {
    const iframeWindow = this.iframeRef?.nativeElement.contentWindow;
    if (iframeWindow) {
      iframeWindow.focus();
      iframeWindow.print();
    }
  }
}
