import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceEditPageComponent } from './resource-edit-page.component';

describe('ResourceEditPageComponent', () => {
  let component: ResourceEditPageComponent;
  let fixture: ComponentFixture<ResourceEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourceEditPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResourceEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
