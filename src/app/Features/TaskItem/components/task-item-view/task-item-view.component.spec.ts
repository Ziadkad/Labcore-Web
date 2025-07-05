import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskItemViewComponent } from './task-item-view.component';

describe('TaskItemViewComponent', () => {
  let component: TaskItemViewComponent;
  let fixture: ComponentFixture<TaskItemViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskItemViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
