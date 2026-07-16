import { TestBed } from '@angular/core/testing';

import { UndopaymentService } from './undopayment-service';

describe('UndopaymentService', () => {
  let service: UndopaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UndopaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
