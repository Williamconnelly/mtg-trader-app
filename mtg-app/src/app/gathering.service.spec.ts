import { TestBed, inject } from '@angular/core/testing';

import { GatheringService } from './gathering.service';

describe('GatheringService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GatheringService]
    });
  });

  it('should be created', inject([GatheringService], (service: GatheringService) => {
    expect(service).toBeTruthy();
  }));
});
