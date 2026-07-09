import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndoCheque } from './undo-cheque';

describe('UndoCheque', () => {
  let component: UndoCheque;
  let fixture: ComponentFixture<UndoCheque>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UndoCheque],
    }).compileComponents();

    fixture = TestBed.createComponent(UndoCheque);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
