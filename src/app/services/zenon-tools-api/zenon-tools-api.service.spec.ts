import { TestBed } from '@angular/core/testing';

import { ZenonToolsApiService } from './zenon-tools-api.service';

describe('ZenonToolsApiService', () => {
  let service: ZenonToolsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZenonToolsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
