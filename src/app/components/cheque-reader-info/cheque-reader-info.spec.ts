import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeReaderInfo } from './cheque-reader-info';

describe('ChequeReaderInfo', () => {
  let component: ChequeReaderInfo;
  let fixture: ComponentFixture<ChequeReaderInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChequeReaderInfo],
    }).compileComponents();

    fixture = TestBed.createComponent(ChequeReaderInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
