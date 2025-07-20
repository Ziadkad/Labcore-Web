import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReservationPageComponent } from './my-reservation-page.component';

describe('MyReservationPageComponent', () => {
  let component: MyReservationPageComponent;
  let fixture: ComponentFixture<MyReservationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyReservationPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyReservationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
