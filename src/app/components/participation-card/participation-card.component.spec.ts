import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipationCardComponent } from './participation-card.component';

describe('ParticipationCardComponent', () => {
  let component: ParticipationCardComponent;
  let fixture: ComponentFixture<ParticipationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipationCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
