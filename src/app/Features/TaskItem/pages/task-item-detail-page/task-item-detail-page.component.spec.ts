import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskItemDetailPageComponent } from './task-item-detail-page.component';

describe('TaskItemDetailPageComponent', () => {
  let component: TaskItemDetailPageComponent;
  let fixture: ComponentFixture<TaskItemDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskItemDetailPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskItemDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
