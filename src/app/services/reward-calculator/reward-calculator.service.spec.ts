import { TestBed } from '@angular/core/testing';

import { RewardCalculatorService } from './reward-calculator.service';

describe('RewardCalculatorService', () => {
  let service: RewardCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RewardCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
