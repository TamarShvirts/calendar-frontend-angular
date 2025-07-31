import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogListSubjectComponent } from './dialog-list-subject.component';

describe('DialogListSubjectComponent', () => {
  let component: DialogListSubjectComponent;
  let fixture: ComponentFixture<DialogListSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogListSubjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogListSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
