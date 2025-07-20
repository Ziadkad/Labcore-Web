import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceCreatePageComponent } from './resource-create-page.component';

describe('ResourceCreatePageComponent', () => {
  let component: ResourceCreatePageComponent;
  let fixture: ComponentFixture<ResourceCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourceCreatePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResourceCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
