import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSec1Component } from './dashboard-sec1.component';

describe('DashboardSec1Component', () => {
  let component: DashboardSec1Component;
  let fixture: ComponentFixture<DashboardSec1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardSec1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardSec1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
