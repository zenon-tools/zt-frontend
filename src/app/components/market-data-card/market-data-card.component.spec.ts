import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketDataCardComponent } from './market-data-card.component';

describe('MarketDataCardComponent', () => {
  let component: MarketDataCardComponent;
  let fixture: ComponentFixture<MarketDataCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketDataCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketDataCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
