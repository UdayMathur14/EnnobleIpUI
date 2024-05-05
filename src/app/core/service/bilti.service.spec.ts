import { TestBed } from '@angular/core/testing';

import { BiltiService } from './bilti.service';

describe('BiltiService', () => {
  let service: BiltiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiltiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
