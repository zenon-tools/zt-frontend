import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalsTableComponent } from './proposals-table.component';

describe('ProposalsTableComponent', () => {
  let component: ProposalsTableComponent;
  let fixture: ComponentFixture<ProposalsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
