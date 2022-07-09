import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardShareGraphCardComponent } from './reward-share-graph-card.component';

describe('RewardShareGraphCardComponent', () => {
  let component: RewardShareGraphCardComponent;
  let fixture: ComponentFixture<RewardShareGraphCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RewardShareGraphCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardShareGraphCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
