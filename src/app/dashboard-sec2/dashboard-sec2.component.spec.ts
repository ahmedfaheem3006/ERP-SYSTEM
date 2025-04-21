import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSec2Component } from './dashboard-sec2.component';

describe('DashboardSec2Component', () => {
  let component: DashboardSec2Component;
  let fixture: ComponentFixture<DashboardSec2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardSec2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardSec2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
