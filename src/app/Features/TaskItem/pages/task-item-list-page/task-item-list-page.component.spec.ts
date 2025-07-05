import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskItemListPageComponent } from './task-item-list-page.component';

describe('TaskItemListPageComponent', () => {
  let component: TaskItemListPageComponent;
  let fixture: ComponentFixture<TaskItemListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskItemListPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskItemListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
