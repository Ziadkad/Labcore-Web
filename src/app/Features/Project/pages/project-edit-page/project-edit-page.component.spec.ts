import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEditPageComponent } from './project-edit-page.component';

describe('ProjectEditPageComponent', () => {
  let component: ProjectEditPageComponent;
  let fixture: ComponentFixture<ProjectEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectEditPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
