import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesWritingComponent } from './notes-writing.component';

describe('NotesWritingComponent', () => {
  let component: NotesWritingComponent;
  let fixture: ComponentFixture<NotesWritingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotesWritingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesWritingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
