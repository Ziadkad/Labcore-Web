import { TestBed } from '@angular/core/testing';

import { ResourceReservationService } from './resource-reservation.service';

describe('ResourceReservationService', () => {
  let service: ResourceReservationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceReservationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
