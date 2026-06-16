import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupModal } from './group-modal';

describe('GroupModal', () => {
  let component: GroupModal;
  let fixture: ComponentFixture<GroupModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupModal],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
