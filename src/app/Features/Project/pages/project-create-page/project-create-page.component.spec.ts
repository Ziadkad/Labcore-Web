import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCreatePageComponent } from './project-create-page.component';

describe('ProjectCreatePageComponent', () => {
  let component: ProjectCreatePageComponent;
  let fixture: ComponentFixture<ProjectCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectCreatePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
