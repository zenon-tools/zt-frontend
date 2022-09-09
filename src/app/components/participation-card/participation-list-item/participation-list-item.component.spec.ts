import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipationListItemComponent } from './participation-list-item.component';

describe('ParticipationListItemComponent', () => {
  let component: ParticipationListItemComponent;
  let fixture: ComponentFixture<ParticipationListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipationListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipationListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
