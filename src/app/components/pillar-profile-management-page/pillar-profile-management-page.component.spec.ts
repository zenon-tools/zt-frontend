import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PillarProfileManagementPageComponent } from './pillar-profile-management-page.component';

describe('PillarProfileManagementPageComponent', () => {
  let component: PillarProfileManagementPageComponent;
  let fixture: ComponentFixture<PillarProfileManagementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PillarProfileManagementPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PillarProfileManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
