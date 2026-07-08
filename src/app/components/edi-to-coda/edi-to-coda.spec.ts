import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdiToCoda } from './edi-to-coda';

describe('EdiToCoda', () => {
  let component: EdiToCoda;
  let fixture: ComponentFixture<EdiToCoda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdiToCoda],
    }).compileComponents();

    fixture = TestBed.createComponent(EdiToCoda);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
