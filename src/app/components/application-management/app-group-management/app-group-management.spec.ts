import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppGroupManagement } from './app-group-management';

describe('AppGroupManagement', () => {
  let component: AppGroupManagement;
  let fixture: ComponentFixture<AppGroupManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppGroupManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(AppGroupManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
