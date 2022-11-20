import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportRewardsModalComponent } from './export-rewards-modal.component';

describe('ExportRewardsModalComponent', () => {
  let component: ExportRewardsModalComponent;
  let fixture: ComponentFixture<ExportRewardsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportRewardsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportRewardsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
