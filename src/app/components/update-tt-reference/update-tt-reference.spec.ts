import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTtReference } from './update-tt-reference';

describe('UpdateTtReference', () => {
  let component: UpdateTtReference;
  let fixture: ComponentFixture<UpdateTtReference>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTtReference],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateTtReference);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
