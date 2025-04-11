import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { CustomerService } from '../../../../../core/service/customer.service';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../../../core/constants';

@Component({
  selector: 'app-customer-filters',
  templateUrl: './customer-filter.component.html',
  styleUrl: './customer-filter.component.scss'
})
export class CustomerFiltersComponent implements OnInit {
  @Input() filters : any = [];
  @Output() getData: EventEmitter<object> = new EventEmitter();
  customerCode: any = undefined;
  customerName:any = undefined;
  status: any = undefined;

  constructor(
    private toastr: ToastrService,
    private elementRef: ElementRef,
  ) { }

  ngOnInit(): void {

  }

  // BINDING PART NUMBERS AND PART NAMES DROPDOWNS

  onCustomerSearch(){
    const obj = {
      "customerCode": this.customerCode,
      "customerName": this.customerName,
      "status": this.status
    }
    this.getData.emit(obj)
  }

  onClearFilter() {
    this.customerName = undefined;
    this.customerCode = undefined;
    this.status = undefined;
    let obj = {
      "customerCode": undefined,
      "customerName": undefined,
      "status": undefined
    }
    this.getData.emit(obj)
  }

}