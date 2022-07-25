import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorTableComponent } from './contributor-table.component';

describe('ContributorTableComponent', () => {
  let component: ContributorTableComponent;
  let fixture: ComponentFixture<ContributorTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContributorTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
