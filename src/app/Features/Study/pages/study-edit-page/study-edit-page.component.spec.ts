import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyEditPageComponent } from './study-edit-page.component';

describe('StudyEditPageComponent', () => {
  let component: StudyEditPageComponent;
  let fixture: ComponentFixture<StudyEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudyEditPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudyEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
