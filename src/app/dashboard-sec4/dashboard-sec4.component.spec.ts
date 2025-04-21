import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSec4Component } from './dashboard-sec4.component';

describe('DashboardSec4Component', () => {
  let component: DashboardSec4Component;
  let fixture: ComponentFixture<DashboardSec4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardSec4Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardSec4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
