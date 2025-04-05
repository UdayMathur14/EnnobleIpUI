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
  customerNum: any = undefined;
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
      "customerName": this.customerName,
      "customerNumber": this.customerNum,
      "status": this.status
    }
    this.getData.emit(obj)
  }

  onClearFilter() {
    this.customerNum = undefined;
    this.customerName = undefined;
    this.status = undefined;
    let obj = {
      "customerName": undefined,
      "customerNumber": undefined,
      "status": undefined
    }
    this.getData.emit(obj)
  }

}