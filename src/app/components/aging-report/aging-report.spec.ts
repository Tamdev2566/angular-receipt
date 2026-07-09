import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgingReport } from './aging-report';

describe('AgingReport', () => {
  let component: AgingReport;
  let fixture: ComponentFixture<AgingReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgingReport],
    }).compileComponents();

    fixture = TestBed.createComponent(AgingReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
