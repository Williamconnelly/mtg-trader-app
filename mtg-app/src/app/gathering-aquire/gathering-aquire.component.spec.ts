import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatheringAquireComponent } from './gathering-aquire.component';

describe('GatheringAquireComponent', () => {
  let component: GatheringAquireComponent;
  let fixture: ComponentFixture<GatheringAquireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatheringAquireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatheringAquireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
