import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskItemTableComponent } from './task-item-table.component';

describe('TaskItemTableComponent', () => {
  let component: TaskItemTableComponent;
  let fixture: ComponentFixture<TaskItemTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskItemTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskItemTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
