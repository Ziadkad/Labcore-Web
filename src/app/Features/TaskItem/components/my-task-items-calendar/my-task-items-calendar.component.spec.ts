import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTaskItemsCalendarComponent } from './my-task-items-calendar.component';

describe('MyTaskItemsCalendarComponent', () => {
  let component: MyTaskItemsCalendarComponent;
  let fixture: ComponentFixture<MyTaskItemsCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyTaskItemsCalendarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyTaskItemsCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
