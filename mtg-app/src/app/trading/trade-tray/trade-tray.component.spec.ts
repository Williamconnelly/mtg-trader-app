import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeTrayComponent } from './trade-tray.component';

describe('TradeTrayComponent', () => {
  let component: TradeTrayComponent;
  let fixture: ComponentFixture<TradeTrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeTrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeTrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
