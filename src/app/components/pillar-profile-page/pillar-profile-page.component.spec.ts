import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PillarProfilePageComponent } from './pillar-profile-page.component';

describe('PillarProfilePageComponent', () => {
  let component: PillarProfilePageComponent;
  let fixture: ComponentFixture<PillarProfilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PillarProfilePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PillarProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
