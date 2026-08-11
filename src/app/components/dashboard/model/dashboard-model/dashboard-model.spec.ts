import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardModel } from './dashboard-model';

describe('DashboardModel', () => {
  let component: DashboardModel;
  let fixture: ComponentFixture<DashboardModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardModel],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardModel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
