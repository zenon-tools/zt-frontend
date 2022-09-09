import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcccountDetailsTableComponent } from './account-details-table.component';

describe('AddressDetailsTableComponent', () => {
  let component: AcccountDetailsTableComponent;
  let fixture: ComponentFixture<AcccountDetailsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcccountDetailsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcccountDetailsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
