import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PillarDelegatorTableComponent } from './pillar-delegator-table.component';

describe('PillarDelegatorTableComponent', () => {
  let component: PillarDelegatorTableComponent;
  let fixture: ComponentFixture<PillarDelegatorTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PillarDelegatorTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PillarDelegatorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
