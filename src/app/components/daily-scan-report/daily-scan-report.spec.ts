import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyScanReport } from './daily-scan-report';

describe('DailyScanReport', () => {
  let component: DailyScanReport;
  let fixture: ComponentFixture<DailyScanReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyScanReport],
    }).compileComponents();

    fixture = TestBed.createComponent(DailyScanReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
