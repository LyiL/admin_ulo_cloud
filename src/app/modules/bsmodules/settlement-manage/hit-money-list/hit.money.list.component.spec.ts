import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HitMoneyComponent } from './hit.money.list.component';

describe('HitMoneyComponent', () => {
  let component: HitMoneyComponent;
  let fixture: ComponentFixture<HitMoneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HitMoneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HitMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
