import { TestBed } from '@angular/core/testing';

import { UndoChequeService } from './undo-cheque-service';

describe('UndoChequeService', () => {
  let service: UndoChequeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UndoChequeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
