import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintReport } from './print-report';

describe('PrintReport', () => {
  let component: PrintReport;
  let fixture: ComponentFixture<PrintReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintReport],
    }).compileComponents();

    fixture = TestBed.createComponent(PrintReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
