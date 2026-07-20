import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingModal } from './outstanding-modal';

describe('OutstandingModal', () => {
  let component: OutstandingModal;
  let fixture: ComponentFixture<OutstandingModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutstandingModal],
    }).compileComponents();

    fixture = TestBed.createComponent(OutstandingModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
