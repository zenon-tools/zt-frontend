import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStatusChipComponent } from './project-status-chip.component';

describe('ProjectStatusChipComponent', () => {
  let component: ProjectStatusChipComponent;
  let fixture: ComponentFixture<ProjectStatusChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectStatusChipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectStatusChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
