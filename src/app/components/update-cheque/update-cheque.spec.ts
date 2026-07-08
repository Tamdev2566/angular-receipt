import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCheque } from './update-cheque';

describe('UpdateCheque', () => {
  let component: UpdateCheque;
  let fixture: ComponentFixture<UpdateCheque>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCheque],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateCheque);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
