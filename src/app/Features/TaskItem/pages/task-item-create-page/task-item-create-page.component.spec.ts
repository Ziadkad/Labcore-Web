import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskItemCreatePageComponent } from './task-item-create-page.component';

describe('TaskItemCreatePageComponent', () => {
  let component: TaskItemCreatePageComponent;
  let fixture: ComponentFixture<TaskItemCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskItemCreatePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskItemCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
