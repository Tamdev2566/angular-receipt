import { TestBed } from '@angular/core/testing';

import { MenuAccessService } from './menu-access';

describe('MenuAccess', () => {
  let service: MenuAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
