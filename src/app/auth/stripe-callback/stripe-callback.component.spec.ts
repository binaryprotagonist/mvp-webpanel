import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeCallbackComponent } from './stripe-callback.component';

describe('StripeCallbackComponent', () => {
  let component: StripeCallbackComponent;
  let fixture: ComponentFixture<StripeCallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeCallbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
