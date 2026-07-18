import { TestBed } from '@angular/core/testing';

import { UpdateChequeService } from './update-cheque-service';

describe('UpdateChequeService', () => {
  let service: UpdateChequeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateChequeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
