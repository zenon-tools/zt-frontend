import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PillarRewardShareTableComponent } from './pillar-reward-share-table.component';

describe('PillarRewardShareTableComponent', () => {
  let component: PillarRewardShareTableComponent;
  let fixture: ComponentFixture<PillarRewardShareTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PillarRewardShareTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PillarRewardShareTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
