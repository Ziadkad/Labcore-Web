import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceDetailPageComponent } from './resource-detail-page.component';

describe('ResourceDetailPageComponent', () => {
  let component: ResourceDetailPageComponent;
  let fixture: ComponentFixture<ResourceDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourceDetailPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResourceDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
