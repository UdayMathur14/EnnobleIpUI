import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../../../core/service/customer.service';
import { CustomerDataModel } from '../../../../core/model/masterModels.model';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LookupService } from '../../../../core/service/lookup.service';
import { APIConstant } from '../../../../core/constants';

@Component({
  selector: 'app-add-edit-customer',
  templateUrl: './add-edit-customer.component.html',
  styleUrl: './add-edit-customer.component.scss'
})
export class AddEditCustomerComponent implements OnInit {
  customerForm: FormGroup;
  customerId: number = 0;
  customerData!: CustomerDataModel;
  customersList: any;
  loadSpinner: boolean = false;
  locationsDropdownData: any = [];
  commonLocations: any[] = [];
  locations: any[] = APIConstant.commonLocationsList;
  locationCode: any;
  customerLocationId: any;

  constructor(private router: Router,
    private customerService : CustomerService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute) {
      this.customerForm = this.formBuilder.group({
        customerType: ['', Validators.required],
        customerCode: ['', Validators.required],
        customerName: ['', Validators.required],
      
        billingAddressLine1: [''],
        billingAddressLine2: [''],
        billingCity: [''],
        billingState: [''],
        billingCountry: [''],
        billingPinCode: [''],
      
        shippingAddressLine1: [''],
        shippingAddressLine2: [''],
        shippingCity: [''],
        shippingState: [''],
        shippingCountry: [''],
        shippingPinCode: [''],
      
        contactPersonName: [''],
        designation: [''],
        email: ['', [Validators.email]],
        mobileNumber: [''],
      
        currency: [''],
        paymentTerms: [''],
      
        status: ['Active', Validators.required]
      });
      
  }

  ngOnInit(): void {
    this.getCommonLocations();
    this.getLocations();
    this.setLocation();
    this.customerId = Number(this.activatedRoute.snapshot.paramMap.get("customerId"));
    this.customerId = this.customerId == 0 ? 0 : this.customerId;
    if (this.customerId != 0) {
      this.getCustomerData(this.customerId)
    }
  }

  //FETCHING SELECTED PART'S DATA FROM API
  getCustomerData(customerId: number) {
    this.loadSpinner = true;
    this.customerService.getCustomerData( customerId).subscribe((response: any) => {
      this.customerForm.patchValue(response);
      this.customerForm.setValue({
         customerType: response.customerType,
        customerCode: response.customerCode,
        customerName: response.customerName,
      
        billingAddressLine1: response.billingAddressLine1,
        billingAddressLine2: response.billingAddressLine2,
        billingCity: response.billingCity,
        billingState: response.billingState,
        billingCountry: response.billingCountry,
        billingPinCode: response.billingPinCode,
      
        shippingAddressLine1: response.shippingAddressLine1,
        shippingAddressLine2: response.shippingAddressLine2,
        shippingCity: response.shippingCity,
        shippingState: response.shippingState,
        shippingCountry: response.shippingCountry,
        shippingPinCode: response.shippingPinCode,
      
        contactPersonName: response.contactPersonName,
        designation: response.designation,
        email: response.email,
        mobileNumber: response.mobileNumber,
      
        currency: response.currency,
        paymentTerms: response.paymentTerms,
      
        status: response.status
      });
      
      this.loadSpinner = false;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  getLocationId(): Promise<void> {
    return new Promise((resolve, reject) => {
      const vehicle = this.customersList.filter((item: any) => {
        return item.id == this.customerId
      });
      if (vehicle.length > 0) {
        this.customerLocationId = vehicle[0].locations.id;
        resolve();
      } else {
        reject('No matching customer found');
      }
    });
    
  }

  getAllCustomersListInit() {
    let data = {
      "customerNumber": '',
      "customerName": '',
      "status": ''
    }
    this.customerService.getCustomers(data).subscribe((response: any) => {
      this.customersList = response.customers;
      this.getLocationId().then(() => {
        this.getCustomerData(this.customerId);
      });
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

  //FUNCTION EXECUTED ON SAVE BUTTON CLICK
  onPressSave() {
    this.loadSpinner = true;
    
      const data = {
        customerType: this.customerForm.controls['customerType']?.value,
        customerCode: this.customerForm.controls['customerCode']?.value,
        customerName: this.customerForm.controls['customerName']?.value,
      
        billingAddressLine1: this.customerForm.controls['billingAddressLine1']?.value,
        billingAddressLine2: this.customerForm.controls['billingAddressLine2']?.value,
        billingCity: this.customerForm.controls['billingCity']?.value,
        billingState: this.customerForm.controls['billingState']?.value,
        billingCountry: this.customerForm.controls['billingCountry']?.value,
        billingPinCode: this.customerForm.controls['billingPinCode']?.value,
      
        shippingAddressLine1: this.customerForm.controls['shippingAddressLine1']?.value,
        shippingAddressLine2: this.customerForm.controls['shippingAddressLine2']?.value,
        shippingCity: this.customerForm.controls['shippingCity']?.value,
        shippingState: this.customerForm.controls['shippingState']?.value,
        shippingCountry: this.customerForm.controls['shippingCountry']?.value,
        shippingPinCode: this.customerForm.controls['shippingPinCode']?.value,
      
        contactPersonName: this.customerForm.controls['contactPersonName']?.value,
        designation: this.customerForm.controls['designation']?.value,
        email: this.customerForm.controls['email']?.value,
        mobileNumber: this.customerForm.controls['mobileNumber']?.value,
      
        currency: this.customerForm.controls['currency']?.value,
        paymentTerms: this.customerForm.controls['paymentTerms']?.value,
      
        status: this.customerForm.controls['status']?.value,
        actionBy: localStorage.getItem("userId")
      };
      
    if (this.customerId > 0) {
      this.updateCustomer(data);
    } else {
      this.createNewCustomer(data);
    }
  }

  //UPDATING PART DATA
  updateCustomer(data: any) {
    this.locationCode = this.customerForm.controls['locationId']?.value;
    const matchedLocation = this.locations?.find((item: any) => item?.code == this.locationCode);
    const matchedLocationId = matchedLocation?.id;
    this.loadSpinner = true;
    this.customerService.updateCustomer(this.customerId, data).subscribe((response: any) => {
      this.customerData = response;
      this.loadSpinner = false;
      this.toastr.success('Customer Updated Successfully');
      this.router.navigate(['master/customer']);
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  getCommonLocations(){
    this.commonLocations = APIConstant.commonLocationsList;
  }

  setLocation(){
    if(!this.customerId){
      this.lookupService.setLocationId(this.customerForm, this.commonLocations, 'locationId');
    }
    
  }

  getLocations() {
    let data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'Locations';
    this.lookupService.getLocationsLookup(data, type).subscribe((res: any) => {
      this.locationsDropdownData = res.lookUps.filter(
        (item: any) => item.status === 'Active' && 
        this.commonLocations.some((location: any) => location.id === item.id));

    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
    });
  }

  //CREATING NEW PART
  createNewCustomer(data: any) {
    this.loadSpinner = true;
    this.customerService.createCustomer(this.locationCode,data).subscribe((response: any) => {
      this.customerData = response;
      this.loadSpinner = false;
      this.toastr.success('Customer Created Successfully');
      this.router.navigate(['/master/customer'])
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  onCancelPress() {
    this.router.navigate(['/master/customer'])
  }

  disableSave(){
    // return !this.customerForm.controls['customerNumber'].value ||
    // !this.customerForm.controls['customerName'].value || 
    // !this.customerForm.controls['customerSize'].value || 
    // !this.customerForm.controls['customerPrice'].value ||
    // !this.customerForm.controls['remarks'].value
  }
}