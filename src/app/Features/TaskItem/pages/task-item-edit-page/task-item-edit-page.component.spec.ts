import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskItemEditPageComponent } from './task-item-edit-page.component';

describe('TaskItemEditPageComponent', () => {
  let component: TaskItemEditPageComponent;
  let fixture: ComponentFixture<TaskItemEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskItemEditPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskItemEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
