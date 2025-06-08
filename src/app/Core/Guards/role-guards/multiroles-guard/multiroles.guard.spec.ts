import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { multirolesGuard } from './multiroles.guard';

describe('multirolesGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => multirolesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
