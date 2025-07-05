import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTaskItemsPageComponent } from './my-task-items-page.component';

describe('MyTaskItemsPageComponent', () => {
  let component: MyTaskItemsPageComponent;
  let fixture: ComponentFixture<MyTaskItemsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyTaskItemsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyTaskItemsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
