import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalInfoCardComponent } from './proposal-info-card.component';

describe('ProposalInfoCardComponent', () => {
  let component: ProposalInfoCardComponent;
  let fixture: ComponentFixture<ProposalInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalInfoCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
