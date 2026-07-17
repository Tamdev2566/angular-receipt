import { TestBed } from '@angular/core/testing';

import { RemoveInvoiceService } from './remove-invoice-service';

describe('RemoveInvoiceService', () => {
  let service: RemoveInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoveInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
