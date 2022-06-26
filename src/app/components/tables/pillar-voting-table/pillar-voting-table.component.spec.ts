import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PillarVotingTableComponent } from './pillar-voting-table.component';

describe('PillarVotingTableComponent', () => {
  let component: PillarVotingTableComponent;
  let fixture: ComponentFixture<PillarVotingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PillarVotingTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PillarVotingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
