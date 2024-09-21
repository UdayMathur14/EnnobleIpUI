import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApOutboundGridTableComponent } from './ap-outbound-grid-table.component';

describe('ApOutboundGridTableComponent', () => {
  let component: ApOutboundGridTableComponent;
  let fixture: ComponentFixture<ApOutboundGridTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApOutboundGridTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApOutboundGridTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
