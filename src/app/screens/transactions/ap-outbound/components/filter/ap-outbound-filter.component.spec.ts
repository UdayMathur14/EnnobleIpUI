import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApOutboundFilterComponent } from './ap-outbound-filter.component';

describe('ApOutboundFilterComponent', () => {
  let component: ApOutboundFilterComponent;
  let fixture: ComponentFixture<ApOutboundFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApOutboundFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApOutboundFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
