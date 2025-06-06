import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../../core/service/customer.service';
import { ToastrService } from 'ngx-toastr';
import { XlsxService } from '../../../core/service/xlsx.service';
import { APIConstant } from '../../../core/constants';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss',
})
export class CustomerComponent implements OnInit {
  customersList: any[] = [];
  loadSpinner: boolean = true;
  isFilters: boolean = true;
  searchedCustomer: string = '';
  fullScreen: boolean = false;
  headers: any[] = [];
  currentPage: number = 1;
  count: number = 10;
  totalCustomers: number = 0;
  filters: any = [];
  appliedFilters: any = [];
  maxCount: number = Number.MAX_VALUE;
  constructor(
    private router: Router,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private xlsxService: XlsxService
  ) {}

  ngOnInit(): void {
    this.getFilteredCustomersList();
  }

  getFilteredCustomersList(
    offset: number = 0,
    count: number = this.count,
    filters: any = this.appliedFilters
  ) {
    let data = {
      customerCode: filters?.customerCode || '',
      customerName: filters?.customerName || '',
      status: filters?.status || ''
    };
    this.customerService.getCustomers(data, offset, count).subscribe(
      (response: any) => {
        console.log(response);
        this.customersList = response.customers;
        this.totalCustomers = response.paging.total;
        this.filters = response.filters;
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }

  getData(e: any) {
    this.appliedFilters = e;
    this.currentPage = 1;
    this.getFilteredCustomersList(0, this.count, this.appliedFilters);
  }

  onCreateCustomer() {
    this.router.navigate(['master/addEditCustomer', '0']);
  }

  onExportHeader(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = 'Customer') {
    let data = {
      customerNumber: this.appliedFilters?.customerNumber || '',
      customerName: this.appliedFilters?.customerName || '',
      status: this.appliedFilters?.status || ''
    };
    this.customerService.getCustomers(data, 0, this.totalCustomers).subscribe(
      (response: any) => {
        const customersListToExport = response.customers;
        // Map the data to include only the necessary fields
        const mappedCustomersList = customersListToExport.map((customer: any) => ({
          customerType: customer.customerType,
          customerCode: customer.customerCode,
          customerName: customer.customerName,
          billingAddressLine1: customer.billingAddressLine1,
          billingAddressLine2: customer.billingAddressLine2,
          billingCity: customer.billingCity,
          billingState: customer.billingState,
          billingCountry: customer.billingCountry,
          billingPinCode: customer.billingPinCode,
          shippingAddressLine1: customer.shippingAddressLine1,
          shippingAddressLine2: customer.shippingAddressLine2,
          shippingCity: customer.shippingCity,
          shippingState:customer.shippingState,
          shippingCountry:customer.shippingState,
          shippingPinCode :customer.shippingPinCode ,
          designation :customer.designation ,
          contactPersonName :customer.contactPersonName ,
          email :customer.email ,
          mobileNumber :customer.mobileNumber ,
          currency:customer.currency ,
          paymentTerms :customer.paymentTerms ,
          status: customer.status 
        }));
        this.xlsxService.xlsxExport(mappedCustomersList, this.headers, fileName);
        this.loadSpinner = false;
      },
      (error) => {
        this.toastr.error(
          error.error.details
            .map((detail: any) => detail.description)
            .join('<br>')
        );
        this.loadSpinner = false;
      }
    );
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getFilteredCustomersList(offset, this.count, this.appliedFilters);
  }

  onPageSizeChange(data: any) {
    this.count = data;
    this.currentPage = 1;
    this.getFilteredCustomersList(0, this.count, this.appliedFilters);
  }
}
