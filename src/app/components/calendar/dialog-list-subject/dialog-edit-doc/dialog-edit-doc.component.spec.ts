import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditDocComponent } from './dialog-edit-doc.component';

describe('DialogEditDocComponent', () => {
  let component: DialogEditDocComponent;
  let fixture: ComponentFixture<DialogEditDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEditDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEditDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
