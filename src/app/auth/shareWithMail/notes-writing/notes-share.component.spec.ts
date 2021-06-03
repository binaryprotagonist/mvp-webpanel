import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesShareComponent } from './notes-share.component';

describe('NotesShareComponent', () => {
  let component: NotesShareComponent;
  let fixture: ComponentFixture<NotesShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotesShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
