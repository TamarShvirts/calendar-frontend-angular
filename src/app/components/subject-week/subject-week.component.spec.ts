import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectWeekComponent } from './subject-week.component';

describe('SubjectWeekComponent', () => {
  let component: SubjectWeekComponent;
  let fixture: ComponentFixture<SubjectWeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectWeekComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
