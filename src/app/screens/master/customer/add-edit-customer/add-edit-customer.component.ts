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
      locationId : ['', Validators.required],
      customerNumber: ['', Validators.required],
      customerName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      customerSize: ['', [Validators.required]],
      customerPrice: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
      remarks: [''],
    });
  }

  ngOnInit(): void {
    this.getCommonLocations();
    this.getLocations();
    this.setLocation();
    this.customerId = Number(this.activatedRoute.snapshot.paramMap.get("customerId"));
    this.customerId = this.customerId == 0 ? 0 : this.customerId;
    if (this.customerId != 0) {
      this.getAllCustomersListInit()
    }
  }

  //FETCHING SELECTED PART'S DATA FROM API
  getCustomerData(customerId: number) {
    this.loadSpinner = true;
    this.customerService.getCustomerData(this.customerLocationId, customerId).subscribe((response: any) => {
      this.customerForm.setValue({
        locationId: response?.locations?.code,
        customerNumber: response.customerNumber,
        customerName: response.customerName,
        description: response.description,
        customerSize: response.customerSize,
        customerPrice: response.customerPrice,
        status: response.status,
        remarks: response.remarks
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
    let data = {
      customerNumber: this.customerForm.controls['customerNumber'].value,
      customerName: this.customerForm.controls['customerName'].value,
      description: this.customerForm.controls['description'].value,
      customerSize: this.customerForm.controls['customerSize'].value,
      remarks: this.customerForm.controls['remarks'].value,
      customerPrice: Number(this.customerForm.controls['customerPrice'].value),
      status: this.customerForm.controls['status'].value,
      modifiedBy: "",
      actionBy: localStorage.getItem("userId")
    }
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
    this.customerService.updateCustomer(matchedLocationId,this.customerId, data).subscribe((response: any) => {
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
    this.locationCode = this.customerForm.controls['locationId']?.value;
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
    return !this.customerForm.controls['customerNumber'].value ||
    !this.customerForm.controls['customerName'].value || 
    !this.customerForm.controls['customerSize'].value || 
    !this.customerForm.controls['customerPrice'].value ||
    !this.customerForm.controls['remarks'].value
  }
}