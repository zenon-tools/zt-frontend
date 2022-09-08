import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTabSelectorComponent } from './table-tab-selector.component';

describe('TableTabSelectorComponent', () => {
  let component: TableTabSelectorComponent;
  let fixture: ComponentFixture<TableTabSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableTabSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableTabSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
