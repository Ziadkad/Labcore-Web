import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { emailNotVerifiedGuard } from './email-not-verified.guard';

describe('emailNotVerifiedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => emailNotVerifiedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
