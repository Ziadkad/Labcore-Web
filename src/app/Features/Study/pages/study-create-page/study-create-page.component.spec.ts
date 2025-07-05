import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyCreatePageComponent } from './study-create-page.component';

describe('StudyCreatePageComponent', () => {
  let component: StudyCreatePageComponent;
  let fixture: ComponentFixture<StudyCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudyCreatePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudyCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
