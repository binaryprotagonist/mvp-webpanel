import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Subscription } from './subscription.component';

describe('subscription', () => {
  let component: Subscription;
  let fixture: ComponentFixture<Subscription>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Subscription ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Subscription);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
