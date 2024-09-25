import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from '../../../../core/service/base.service';
import { VehicleService } from '../../../../core/service/vehicle.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VehicleDataModel } from '../../../../core/model/masterModels.model';
import { APIConstant } from '../../../../core/constants';
import { LookupService } from '../../../../core/service/lookup.service';
import { TransporterService } from '../../../../core/service/transporter.service';

@Component({
  selector: 'app-add-edit-vehicle',
  templateUrl: './add-edit-vehicle.component.html',
  styleUrl: './add-edit-vehicle.component.scss',
})
export class AddEditVehicleComponent implements OnInit {
  vehicleId: any;
  vehicleData!: VehicleDataModel;
  vehiclesList: any = [];
  loadSpinner: boolean = true;
  lookupsList: any;
  transportersList: any;
  transporterId: number = 0;
  transporterData: any
  vehcileSizes: any = []
  locationId!:Number;
  locations: any[] = APIConstant.commonLocationsList;
  commonLocations: any[] = [];
  locationCode: any
  vehicleLocationId: number = 0;
  transporterOffset: number = 0;
  transporterCount: number = Number.MAX_VALUE;
  filteredTransporter: any = [];
  locationsDropdownData: any = [];
  
  constructor(
    private router: Router,
    private _route: ActivatedRoute,
    private vehicleService: VehicleService,
    private toastr: ToastrService,
    private baseService: BaseService,
    private lookUpService: LookupService,
    private transporterService: TransporterService,
    private lookupService: LookupService
  ) { }

  vehicleForm = new FormGroup({
    locationId :new FormControl('', [Validators.required]),
    vehicleNumber: new FormControl('', [Validators.required]),
    transporterName: new FormControl(null, [Validators.required]),
    vehicleSize: new FormControl(null, [Validators.required]),
    vehicleCondition: new FormControl('', [Validators.required]),
    remarks: new FormControl('', [Validators.required]),
    vehicleStatus: new FormControl('Active', [Validators.required]),
    ownerName: new FormControl(''),
    address: new FormControl(''),
    mobileNumber1: new FormControl(''),
    emailId: new FormControl(''),
  });

  ngOnInit(): void {
    this.getCommonLocations();
    this.getAllTransportersList();
    this.getLocations();
    if (!this.vehicleId) {
      this.loadSpinner = false;
    }

    this._route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('vehicleId')) {
        this.vehicleId = paramMap.get('vehicleId')
      } else {
        this.vehicleId = null;
      }
    })
    if(this.vehicleId > 0){
      this.getEditVehicleData();
    }
    this.getAllLookups();
    this.getVehicleSizeDropdownData();
    this.setLocation();
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

  // GET THE DATA OF SPECIFIC VEHICLE
  getVehicleData(vehicleId: string) {
    this.loadSpinner = true;
    this.loadSpinner = true;
    if (this.vehicleId) {
      this.loadSpinner = true;
      this.vehicleService.getVehicleData(this.vehicleLocationId,vehicleId).subscribe((response: any) => {
        this.vehicleData = response;
        this.patchVehicleForm(response);
        this.loadSpinner = false;
      }, error => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      })
    }
  }

  // PATCHING VALUE ON EDIT FORM
  patchVehicleForm(data: any) {
    this.vehicleForm.patchValue({
      vehicleNumber: data.vehicleNumber,
      transporterName: data.transporterEntity.transporterName,
      vehicleSize: data.vehicleSizeId,
      vehicleCondition: data.vehicleCondition,
      remarks: data.remarks,
      vehicleStatus: data.status,
      ownerName: data.transporterEntity.ownerName,
      address: data.transporterEntity.transporterAddress1,
      mobileNumber1: data.transporterEntity.transporterContactNo,
      emailId: data.transporterEntity.transporterMailId,
      locationId:  data.locations.code
    });
  }

  onOptionSelected(selectedId: any) {
    this.transporterId = selectedId;
    this.getTransporterData(this.transporterId)
    this.vehicleForm.patchValue({
      address: null,
      ownerName: null,
      mobileNumber1: null,
      emailId: null
    })
  }

  // CREATING OR EDITING NEW VEHICLE
  onPressSave() {
    this.loadSpinner = true;
    this.locationCode = this.vehicleForm.controls['locationId']?.value;
    const matchedLocation = this.locations?.find((item: any) => item?.code == this.locationCode);
    const matchedLocationId = matchedLocation?.id;
    if (this.vehicleId) {
      let data = {
        transporterId: 1,
        vehicleCondition: this.vehicleForm.get('vehicleCondition')?.value,
        remarks: this.vehicleForm.get('remarks')?.value,
        status: this.vehicleForm.get('vehicleStatus')?.value,
        actionBy: localStorage.getItem("userId"),
      }

      this.vehicleService.updateVehicle(matchedLocationId,this.vehicleId, data)
        .subscribe((response: any) => {
          this.vehicleData = response;
          this.toastr.success('Vehicle Updated Successfully')
          this.loadSpinner = false;
          this.router.navigate(['/master/vehicle'])
        }, error => {
          //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
          this.loadSpinner = false;
        })
    }

    if (!this.vehicleId) {
      let data = {
        vehicleNumber: this.vehicleForm.get('vehicleNumber')?.value,
        vehicleSizeId: this.vehicleForm.get('vehicleSize')?.value,
        transporterId: this.transporterId,
        actionBy: localStorage.getItem("userId"),
        vehicleCondition: this.vehicleForm.get('vehicleCondition')?.value,
        remarks: this.vehicleForm.get('remarks')?.value,
        status: this.vehicleForm.get('vehicleStatus')?.value,
      }

      this.vehicleService.createVehicle(this.locationCode,data)
        .subscribe((response: any) => {
          this.vehicleData = response;
          this.toastr.success('Vehicle Created Successfully')
          this.router.navigate(['/master/vehicle'])
          this.loadSpinner = false;
        }, error => {
          //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
          this.loadSpinner = false;
        })
    }

  }

  // GET VEHICLE SIZE
  getAllLookups() {
    let data = {
      "code": 'VehicleSize',
    }
    this.vehicleService.getLookups(data).subscribe((response: any) => {
      this.lookupsList = response.lookUps.filter(
        (item: any) => item.status === 'Active');
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
    })
  }

  getAllTransportersList() {
    let data = {
      "transporterCode": '',
      "transporterName": ''
    }
    this.transporterService.getTransporters(data, this.transporterOffset, this.transporterCount).subscribe((response: any) => {
      this.transportersList = response.transporters.filter((item: any) => item?.status == 'Active');
      this.loadSpinner = false;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  getTransporterData(transporterId: any) {
    this.loadSpinner = true;
    this.vehicleService.getTransporterData(transporterId).subscribe((response: any) => {
      this.patchTransporterField(response);
      this.loadSpinner = false;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  patchTransporterField(data: any) {
    this.vehicleForm.patchValue({
      ownerName: data.ownerName,
      address: data.transporterAddress1,
      mobileNumber1: data.transporterContactNo,
      emailId: data.transporterMailId,
    });

  }

  // ROUTING TO MASTER PAGE
  onCancelPress() {
    this.router.navigate(['master/vehicle']);
  }

  getVehicleSizeDropdownData() {
    let data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'VehicleSize'
    this.vehicleService.getDropdownData(data, type).subscribe((res: any) => {
      this.vehcileSizes = res.lookUps.filter(
        (item: any) => item.status === 'Active')
    })
  }

  setLocation(){
    if(!this.vehicleId){
      this.lookUpService.setLocationId(this.vehicleForm, this.commonLocations, 'locationId');
    }
  }

  getEditVehicleData(){
    let data = {
      "locationIds": APIConstant.commonLocationsList.map((e:any)=>(e.id)),
      "vehicleNumber": "",
      "transporterId": 0
    }
    this.vehicleService.getVehicles(data).subscribe((response:any) => {
      this.vehiclesList = response.vehicles;
      this.getLocationId().then(() => {
        this.getVehicleData(this.vehicleId);
      });
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  getLocationId(): Promise<void> {
    return new Promise((resolve, reject) => {
      const vehicle = this.vehiclesList.filter((item: any) => {
        return item.id == this.vehicleId
      });
      if (vehicle.length > 0) {
        this.vehicleLocationId = vehicle[0].locations.id;
        resolve();
      } else {
        reject('No matching vehicle found');
      }
    });
  }

  onLocationSelect(event: any){
    this.filteredTransporter = this.transportersList.filter((item: any) => item?.locations?.id == event);
    this.vehicleForm.patchValue({
      transporterName: null
    })
  }
}
