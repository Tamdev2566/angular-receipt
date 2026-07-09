import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndoChequeReaderReport } from './undo-cheque-reader-report';

describe('UndoChequeReaderReport', () => {
  let component: UndoChequeReaderReport;
  let fixture: ComponentFixture<UndoChequeReaderReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UndoChequeReaderReport],
    }).compileComponents();

    fixture = TestBed.createComponent(UndoChequeReaderReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
