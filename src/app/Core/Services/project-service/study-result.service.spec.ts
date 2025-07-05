import { TestBed } from '@angular/core/testing';

import { StudyResultService } from './study-result.service';

describe('StudyResultService', () => {
  let service: StudyResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudyResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
