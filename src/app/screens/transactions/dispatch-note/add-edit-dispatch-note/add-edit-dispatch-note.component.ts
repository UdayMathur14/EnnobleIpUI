import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../../../core/service/customer.service';
import { ToastrService } from 'ngx-toastr';
import { VehicleService } from '../../../../core/service/vehicle.service';
import { VendorService } from '../../../../core/service/vendor.service';
import { DispatchNoteService } from '../../../../core/service/dispatch-note.service';
import { BaseService } from '../../../../core/service/base.service';
import { LookupService } from '../../../../core/service/lookup.service';
import { APIConstant } from '../../../../core/constants';
import { TransporterService } from '../../../../core/service/transporter.service';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-edit-dispatch-note',
  templateUrl: './add-edit-dispatch-note.component.html',
  styleUrl: './add-edit-dispatch-note.component.scss',
})
export class AddEditDispatchNoteComponent {
  addOrEditDispatchNoteFormGroup!: FormGroup;

  customerNum: string | undefined;
  customersList: any[] = [];
  allcustomersNames: string[] = [];
  vehicleList: any[] = [];
  allVehiclNumbers: string[] = [];
  dispatchNote!: any;
  supplierList: any[] = [];
  customerDetailsList: any[] = []; //just to show customer data on table
  supplierId!: number;
  vehicleId!: number;
  customerQtyId: number = 0;
  lookupList: any[] = [];
  selectedcustomerNumber!: string;
  selectedQuantity!: number;
  dispatchId: number = 0;
  loadSpinner: boolean = false;
  locationId!: Number;
  locations: any[] = APIConstant.commonLocationsList;
  commonLocations: any[] = [];
  selectedcustomers: any = [];
  deletedcustomers: any[] = [];
  activeSuppliersLists: any[] = [];
  activeVehiclesLists: any[] = [];
  activecustomersLists: any[] = [];
  dispatchNotes: any = [];
  dispatchLocationId: number = 0;
  transportersList: any = [];
  activeTransportersList: any = [];
  // frlrDate!: NgbDateStruct | null;
  today = inject(NgbCalendar).getToday();
  frlrDate: any;
  vehicleData: any = [];
  transporterMode: any = [];
  filteredTransporter: any = [];
  filteredVehicles: any = [];
  locationsDropdownData: any = [];
  selectedLocationId: number = 0;
  matchedvehicle: any = [];
  selectedTransporterId: number = 0;
  filteredcustomers: any = [];

  constructor(
    private router: Router,
    private customerService:CustomerService,
    private toastr: ToastrService,
    private vehicleService: VehicleService,
    private vendorService: VendorService,
    private dispatchNoteService: DispatchNoteService,
    private baseService: BaseService,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private transporterService: TransporterService
  ) { }

  ngOnInit() {
    this.getCommonLocations();
    this.getLocations();
    this.initForm();
    this.dispatchId = Number(
      this.activatedRoute.snapshot.paramMap.get('dispatchId')
    );
    const locationId = this.activatedRoute.snapshot.paramMap.get('locationId');
    if(locationId){
      this.locationId = Number(locationId);
    }
    this.getAllcustomersListInit();
    this.getAllVehicles();
    this.getAllVendors();
    this.dispatchNoteInit();
    this.getAllLookups();
    this.getTransportersList();
    this.setLocation();
    if(this.dispatchId == 0){
      this.setCurrentDate();
    }

    setTimeout(() => {
      if (this.dispatchId > 0) {
        this.getEditData();
      }
    }, 1000);
    this.selectedLocationId = this.addOrEditDispatchNoteFormGroup?.controls['locationId']?.value;
    
  }

  initForm() {
    this.addOrEditDispatchNoteFormGroup = this.fb.group({
      locationId: '',
      supplierCode: ['', [Validators.required]],
      supplierName: [''],
      supplierAddress: [''],
      vehicleNumber: ['', [Validators.required]],
      vehicleSize: [''],
      frlrNumber: [''],
      status: ['Active'],
      transporterCode: ['', [Validators.required]],
      transporterName: [''],
      transporterMode: [''],
      frlrDate: [''],
      customerdetails: this.fb.array([], Validators.required),
    });
  }

  getCommonLocations(){
    this.commonLocations = APIConstant.commonLocationsList;
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

  createcustomerDetailsGroup() {
    const detail = this.fb.group({
      customerId: [''],
      customerNumber: ['', [Validators.required]],
      customerName: [''],
      customerSize: [''],
      customerQuantity: ['', [Validators.required]],
      remarks: [''],
      status: ['Active'],
      id: [0]
    });

    this.customerDetails.push(detail);
  }

  get customerDetails(): FormArray {
    return this.addOrEditDispatchNoteFormGroup.get('customerdetails') as FormArray;
  }

  async getDispatchData(dispatchId: number) {
    this.loadSpinner = true
    await this.dispatchNoteService
      .getDispatchNoteById(this.dispatchLocationId, dispatchId)
      .subscribe((response: any) => {
        this.selectedTransporterId = response?.transporterId;
        setTimeout(() => {
          this.onTransporterSelection(this.selectedTransporterId);
        }, 1000);
        // this.matchedvehicle = this.filteredVehicles.filter((item:any) => item?.transporterId == this.selectedTransporterId)
        this.onLocationSelect(response.locationId);
        this.loadSpinner = false;
        const vehicles = response.vehicles;
        const suppliers = response.suppliers;
        this.supplierId = suppliers.id;
        this.vehicleId = vehicles.id;
        const frlrDate = this?.convertToNgbDate(response?.frlrDate)
        this.frlrDate = response?.frlrDate
        this.dispatchNote.status = 'Active';
        this.addOrEditDispatchNoteFormGroup.patchValue({
          vehicleNumber: vehicles.vehicleNumber,
          vehicleSize: vehicles.vehicleSize.value,
          supplierName: suppliers.vendorName,
          supplierCode: suppliers.vendorCode,
          frlrNumber: response.frlrNumber,
          supplierAddress: suppliers.vendorAddress1,
          status: response.status,
          locationId: response.locations.code,
          transporterCode: response.transporterId,
          transporterName: response.transporter.transporterName,
          transporterMode: response?.transporterMode,
          frlrDate: frlrDate,
        });

        response?.dispatchNotecustomerItems?.forEach(
          (customerItem: any, index: number) => {
            this.createcustomerDetailsGroup();
            const customerDetailsGroup = this.customerDetails.at(index) as FormGroup;
            customerDetailsGroup.patchValue({
              customerNumber: customerItem.customers.customerNumber,
              customerName: customerItem.customers.customerName,
              customerId: customerItem.customers.id,
              customerSize: customerItem.customers.customerSize,
              remarks: customerItem.customers.remarks,
              customerQuantity: customerItem.customersQty,
              status: customerItem.status,
              id: customerItem.id
            });
            const selectedcustomerNumbers = this.customerDetails.controls.map(control => control.value.customerNumber);
            this.initializeSelectedcustomers(selectedcustomerNumbers)
            const transporters = this.transportersList.find((item: any) => {
              return item.id == response?.transporterId;
             })
             this.vehicleData = this.vehicleList?.filter((item: any) => item?.transporterEntity?.id == response?.transporterId);
             this.transporterMode = transporters?.transporterMappings?.map((item: any) => item.transportationMode)
          }
        );
      }, error => {
        // this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      });
  }

  mapQuantities(qtyId: any) {
    const lookupItem = this.lookupList.find((lookup) => qtyId === lookup.id);
    return lookupItem?.id;
  }

  private async getAllcustomersListInit() {
    this.loadSpinner = true;
    const data = {
      customerNumber: '',
      customerName: '',
    };
    await this.customerService.getCustomers(data).subscribe(
      (response: any) => {
        this.customersList = response.customers;
        this.activecustomersLists = this.customersList.filter(
          (customers: any) => customers.status === 'Active'
        );
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      }
    );
  }

  private async getAllVehicles() {
    this.loadSpinner = true;
    const data = {};
    await this.vehicleService.getVehicles(data).subscribe(
      (response: any) => {
        this.vehicleList = response.vehicles;
        this.activeVehiclesLists = this.vehicleList.filter(
          (vehicle: any) => vehicle.status === 'Active'
        );
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      }
    );
  }

  private async getAllVendors() {
    this.loadSpinner = true;
    const data = {
      vendorCode: '',
      vendorName: '',
    };
    await this.vendorService.getVendors(data).subscribe(
      (response: any) => {
        this.supplierList = response.vendors;
        this.activeSuppliersLists = this.supplierList.filter(
          (supplier: any) => supplier.status === 'Active' || supplier.status === 'ACTIVE'
        );
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      }
    );
  }

  private async getAllLookups() {
    this.loadSpinner = true;
    let data = {
      type: 'customerQuantity',
    };
    await this.lookupService.getDropdownData(data.type).subscribe(
      (response: any) => {
        this.lookupList = response.lookUps.filter(
          (item: any) => item.status === 'Active');
        this.loadSpinner = false;
      },
      (error: any) => {
        this.loadSpinner = false;
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      }
    );
  }

  onCancelPress() {
    this.router.navigate(['transaction/dispatchNote']);
  }

  private dispatchNoteInit() {
    this.dispatchNote = {
      actionBy: localStorage.getItem("userId"),
      attribute1: '',
      attribute2: '',
      attribute3: '',
      attribute4: '',
      attribute5: 0,
      attribute6: 0,
      attribute7: 0,
      attribute8: 0,
      attribute9: new Date(),
      attribute10: new Date(),
      frlrNumber: '',
      supplierId: 0,
      vehicleId: 0,
      customerDetails: [],
      id: this.dispatchId,
      transporterId: 0,
      frlrDate: '',
      transporterMode: ''
    };
  }

  onVehicleNumberSelection(event: any) {
    const vehicleNumber = event;
    if (!!vehicleNumber) {
      this.vehicleList.forEach((vehicle) => {
        if (vehicle.vehicleNumber === vehicleNumber) {
          this.addOrEditDispatchNoteFormGroup.patchValue({
            vehicleSize: vehicle?.vehicleSize?.value,
          });
          this.vehicleId = vehicle.id;
        }
      });
    }
  }

  onVehicleNumberClear() {
    this.addOrEditDispatchNoteFormGroup.patchValue({
      vehicleSize: null,
    });
  }

  onSupplierCodeSelection(event: any) {
    const supplierCode = event;
    if (!!supplierCode) {
      this.supplierList.forEach((supplier) => {
        if (supplier.vendorCode === supplierCode) {
          this.addOrEditDispatchNoteFormGroup.patchValue({
            supplierName: supplier.vendorName,
            supplierAddress: supplier.vendorAddress1,
          });
          this.supplierId = supplier.id;
        }
      });
    }
  }

  onSupplierCodeClear() {
    this.addOrEditDispatchNoteFormGroup.patchValue({
      supplierName: null,
      supplierAddress: null,
    });
  }

  onDeletecustomerDetail(customer: any, i: number) {
    const deletedcustomer = {
        actionBy: localStorage.getItem("userId"),
        attribute9: new Date(),
        attribute10: new Date(),
        customerId: customer.value.customerId,
        customerQty: customer.value.customerQuantity,
        status: 'Inactive',
        id: customer.value.id,
    };
    if (this.dispatchId > 0 && deletedcustomer.id != 0) {
        this.deletedcustomers.push(deletedcustomer);
    }
    this.customerDetails.removeAt(i);
    const customerNumber = customer.value.customerNumber;
    const index = this.selectedcustomers.indexOf(customerNumber);
    if (index > -1) {
        this.selectedcustomers.splice(index, 1);
    }
    this.updateSelectedcustomers(this.selectedcustomers);
}


  oncustomerSelect(data: any, i: number) {
    const detailsArray = this.addOrEditDispatchNoteFormGroup.get('customerdetails') as FormArray;
    const detailsGroup = detailsArray.at(i) as FormGroup;

    detailsGroup.patchValue({
      customerId: data?.id,
      customerNumber: data?.customerNumber,
      customerName: data?.customerName,
      customerSize: data?.customerSize,
      remarks: data?.remarks
    });
    const selectedcustomerNumbers = detailsArray.controls.map(control => control.value.customerNumber);
    this.updateSelectedcustomers(selectedcustomerNumbers);
  }

  getFilteredcustomerNumbers(index: number) {
    return this.filteredcustomers.filter(
      (customers: any) =>
        !this.selectedcustomers.includes(customers.customerNumber)
    );
  }

  updateSelectedcustomers(selectedcustomerNumbers: string[]) {
    this.selectedcustomers = selectedcustomerNumbers;
  }


  initializeSelectedcustomers(selectedcustomerNumbers: string[]) {
    this.selectedcustomers = selectedcustomerNumbers;
  }

  onQuantitySelection(quantity: any, i: number) {
    const detailsArray = this.addOrEditDispatchNoteFormGroup.get(
      'customerdetails'
    ) as FormArray;
    const detailsGroup = detailsArray.at(i) as FormGroup;
    detailsGroup.patchValue({
      customerQuantity: quantity,
    });
  }

  async onSavePress() {
    const locationCode = this.addOrEditDispatchNoteFormGroup.controls['locationId']?.value;
    const matchedLocation = this.locations?.find((item: any) => item?.code == locationCode);
    const matchedLocationId = matchedLocation?.id
    this.loadSpinner = true;
    this.dispatchNote.supplierId = this.supplierId;
    this.dispatchNote.vehicleId = this.vehicleId;
    this.dispatchNote.frlrNumber = this.addOrEditDispatchNoteFormGroup.controls[
      'frlrNumber'
    ].value as string || '';
    this.dispatchNote.transporterId = this.addOrEditDispatchNoteFormGroup.controls['transporterCode']?.value,
    this.dispatchNote.frlrDate = this.frlrDate || null,
    this.dispatchNote.transporterMode = this.addOrEditDispatchNoteFormGroup.controls['transporterMode']?.value

    const detailsArray = this.addOrEditDispatchNoteFormGroup.get(
      'customerdetails'
    ) as FormArray;

    if (this.dispatchId > 0) {
      this.dispatchNote.customerDetails = [];
      for (let i = 0; i < detailsArray.length; i++) {
        const dg = detailsArray.at(i) as FormGroup;
        let note = {
          actionBy: localStorage.getItem("userId"),
          attribute1: '',
          attribute2: '',
          attribute3: '',
          attribute4: '',
          attribute5: 0,
          attribute6: 0,
          attribute7: 0,
          attribute8: 0,
          attribute9: new Date(),
          attribute10: new Date(),
          customerId: dg.controls['customerId'].value,
          customerQty: parseInt(dg.controls['customerQuantity'].value),
          status: dg.controls['status'].value,
          id: dg.controls['id'].value || 0,
          dispatchNoteid: this.dispatchId
        };
        this.dispatchNote.customerDetails.push(note);
      }
      this.dispatchNote.customerDetails = [...this.dispatchNote.customerDetails, ...this.deletedcustomers];

      this.dispatchNoteService
        .updateDispatchNote(matchedLocationId, this.dispatchId, this.dispatchNote)
        .subscribe(
          (response: any) => {
            this.toastr.success('Dispatch Note Updated Successfully');
            this.loadSpinner = false;
            this.router.navigate(['transaction/dispatchNote'])
          },
          (error) => {
            this.loadSpinner = false;
            //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
          }
        );
    } else {
      this.dispatchNote.customerDetails = [];
      for (let i = 0; i < detailsArray.length; i++) {
        const dg = detailsArray.at(i) as FormGroup;
        let note = {
          actionBy: localStorage.getItem("userId"),
          attribute1: '',
          attribute2: '',
          attribute3: '',
          attribute4: '',
          attribute5: 0,
          attribute6: 0,
          attribute7: 0,
          attribute8: 0,
          attribute9: new Date(),
          attribute10: new Date(),
          customerId: dg.controls['customerId'].value,
          customerQty: parseInt(dg.controls['customerQuantity'].value),
          // status: "Active",
        };
        this.dispatchNote.customerDetails.push(note);
      }

      await this.dispatchNoteService
        .createDispatchNote(locationCode,this.dispatchNote)
        .subscribe(
          (response: any) => {
            this.dispatchNote = response;
            this.toastr.success('Dispatch Created Successfully');
            this.loadSpinner = false;
            this.router.navigate(['transaction/dispatchNote']);
          },
          (error) => {
            this.loadSpinner = false;
            //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
          }
        );
    }
  }

  validateNo(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false
    }
    return true;
  }

  isFormInvalid() {
    return !this.addOrEditDispatchNoteFormGroup.controls['locationId']?.value 
    || !this.addOrEditDispatchNoteFormGroup.controls['supplierCode']?.value ||
    !this.addOrEditDispatchNoteFormGroup.controls['transporterCode']?.value ||
    !this.addOrEditDispatchNoteFormGroup.controls['transporterMode']?.value ||
    !this.addOrEditDispatchNoteFormGroup.controls['vehicleNumber']?.value
  }

  setLocation(){
    if(!this.vehicleId){
      this.lookupService.setLocationId(this.addOrEditDispatchNoteFormGroup, this.commonLocations, 'locationId');
    }
  }

  getEditData(dispatchNumber: string = "", locationIds: any[] = []) {
    this.loadSpinner = true;
    this.dispatchNoteService.getDispatchNote({ dispatchNumber, locationIds }).subscribe((res: any) => {
      this.dispatchNotes = res.dispatchNotes;
      this.getLocationId().then(() => {
        this.getDispatchData(this.dispatchId);
      });
    })
  }

  getLocationId(): Promise<void> {
    return new Promise((resolve, reject) => {
      const dispatchNote = this.dispatchNotes.filter((item: any) => {
        return item?.id == this.dispatchId
      });
      if (dispatchNote.length > 0) {
        this.dispatchLocationId = dispatchNote[0].locations.id;
        resolve();
      } else {
        reject('No matching dispatch note found');
      }
    });
  }

  getTransportersList() {
    let data = {
      "locationIds": APIConstant.commonLocationsList.map((e:any)=>(e.id)),
      "transporterCode": "",
      "transporterName": "",
      "city": "",
      "state": "",
      "taxationType": ""
    }
    this.transporterService.getTransporters(data).subscribe((response: any) => {
      if (response && response.transporters) {
      this.transportersList = response.transporters;
      this.activeTransportersList = this.transportersList.filter(
        (items: any) => items.status === 'Active'
      );
      if (this.transportersList.length > 0) {
        this.onLocationSelect(this.selectedLocationId);
      }
    }
      this.loadSpinner = false;
    }, error => {
      // this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  onTransporterSelection(data: any){
    const transporters = this.transportersList.find((item: any) => {
     return item.id == data;
    })
    this.vehicleData = this.vehicleList?.filter((item: any) => item?.transporterEntity?.id == data);
    const transporter = transporters?.transporterMappings?.filter((item: any) => item?.locationId == this.selectedLocationId && item?.status == 'Active');
    this.transporterMode = transporter?.map((item: any) => item.transportationMode);
    if(this.transporterMode.length <=1){
      this.addOrEditDispatchNoteFormGroup.patchValue({
        transporterMode: this.transporterMode[0]?.value
      })
    }
    this.addOrEditDispatchNoteFormGroup.patchValue({
      transporterName: transporters?.transporterName
    })
    
    this.matchedvehicle = this.filteredVehicles.filter((item:any) => item?.transporterId == data)
   
  }

  setCurrentDate(): void {   
    this.addOrEditDispatchNoteFormGroup.patchValue({
      frlrDate: this.today,
    });
    const month = Number(this.today.month) < 10 ? '0' + this.today.month : this.today.month;
    const day = Number(this.today.day) < 10 ? '0' + this.today.day : this.today.day;
      this.frlrDate = this.today.year + '-' + month.toString() + '-' + day.toString();
  }


  onDateSelect(type: string, e: any) {
    const month = Number(e.month) < 10 ? '0' + e.month : e.month;
    const day = Number(e.day) < 10 ? '0' + e.day : e.day;
      this.frlrDate = e.year + '-' + month.toString() + '-' + day.toString();
  }

  convertToNgbDate(dateString: string): any {
    if(dateString){
      const datecustomers = dateString?.split('-');
      return new NgbDate(
        parseInt(datecustomers[0], 10),
        parseInt(datecustomers[1], 10),
        parseInt(datecustomers[2], 10)
      );
    }
    }

    onLocationSelect(event: any){
      this.selectedLocationId = event;
      this.filteredTransporter = this.activeTransportersList.filter((item: any) => {
        return item.transporterMappings.some((mapping: any) => mapping.locationId === event);
      });
      this.filteredVehicles = this.activeVehiclesLists.filter((item: any) => item?.locations?.id == event);
      this.filteredcustomers = this.activecustomersLists.filter((item: any) => item?.locations?.id == event);
      this.addOrEditDispatchNoteFormGroup.patchValue({
        transporterCode: null,
        transporterName: null
      })

      this.addOrEditDispatchNoteFormGroup.patchValue({
        vehicleNumber: null,
        vehicleSize: null
      })
    }

}
