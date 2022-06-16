import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteBreakdownCardComponent } from './vote-breakdown-card.component';

describe('VoteBreakdownCardComponent', () => {
  let component: VoteBreakdownCardComponent;
  let fixture: ComponentFixture<VoteBreakdownCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoteBreakdownCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteBreakdownCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
