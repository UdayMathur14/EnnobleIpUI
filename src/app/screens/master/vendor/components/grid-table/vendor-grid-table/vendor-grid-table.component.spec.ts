import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorGridTableComponent } from './vendor-grid-table.component';

describe('VendorGridTableComponent', () => {
  let component: VendorGridTableComponent;
  let fixture: ComponentFixture<VendorGridTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendorGridTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendorGridTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
