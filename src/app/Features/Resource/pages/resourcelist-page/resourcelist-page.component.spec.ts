import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcelistPageComponent } from './resourcelist-page.component';

describe('ResourcelistPageComponent', () => {
  let component: ResourcelistPageComponent;
  let fixture: ComponentFixture<ResourcelistPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourcelistPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResourcelistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
