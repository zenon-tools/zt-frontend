import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldersTableComponent } from './holders-table.component';

describe('HoldersTableComponent', () => {
  let component: HoldersTableComponent;
  let fixture: ComponentFixture<HoldersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoldersTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
