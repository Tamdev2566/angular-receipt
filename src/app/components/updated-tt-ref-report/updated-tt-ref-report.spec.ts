import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedTtRefReport } from './updated-tt-ref-report';

describe('UpdatedTtRefReport', () => {
  let component: UpdatedTtRefReport;
  let fixture: ComponentFixture<UpdatedTtRefReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatedTtRefReport],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatedTtRefReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
