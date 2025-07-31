import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteDocComponent } from './dialog-delete-doc.component';

describe('DialogDeleteDocComponent', () => {
  let component: DialogDeleteDocComponent;
  let fixture: ComponentFixture<DialogDeleteDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDeleteDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDeleteDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
