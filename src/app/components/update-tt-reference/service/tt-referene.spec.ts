import { TestBed } from '@angular/core/testing';

import { TtReferene } from './tt-referene';

describe('TtReferene', () => {
  let service: TtReferene;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TtReferene);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
