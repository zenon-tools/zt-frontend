import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokensPageComponent } from './tokens-page.component';

describe('TokensPageComponent', () => {
  let component: TokensPageComponent;
  let fixture: ComponentFixture<TokensPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokensPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokensPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
