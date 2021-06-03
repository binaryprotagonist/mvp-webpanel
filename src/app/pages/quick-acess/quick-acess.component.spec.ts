import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickAcessComponent } from './quick-acess.component';

describe('QuickAcessComponent', () => {
  let component: QuickAcessComponent;
  let fixture: ComponentFixture<QuickAcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickAcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickAcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
