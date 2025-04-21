import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSec3Component } from './dashboard-sec3.component';

describe('DashboardSec3Component', () => {
  let component: DashboardSec3Component;
  let fixture: ComponentFixture<DashboardSec3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardSec3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardSec3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
