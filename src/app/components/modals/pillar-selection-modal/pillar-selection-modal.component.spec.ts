import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PillarSelectionModalComponent } from './pillar-selection-modal.component';

describe('PillarSelectionModalComponent', () => {
  let component: PillarSelectionModalComponent;
  let fixture: ComponentFixture<PillarSelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PillarSelectionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PillarSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
