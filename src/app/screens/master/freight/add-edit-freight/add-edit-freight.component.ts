import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FreightService } from '../../../../core/service/freight.service';
import { BaseService } from '../../../../core/service/base.service';
import { FreightDataModel } from '../../../../core/model/masterModels.model';
import { APIConstant } from '../../../../core/constants';
import { LookupService } from '../../../../core/service/lookup.service';

@Component({
  selector: 'app-add-edit-freight',
  templateUrl: './add-edit-freight.component.html',
  styleUrl: './add-edit-freight.component.scss'
})
export class AddEditFreightComponent implements OnInit {

  freightForm: FormGroup;
  freightData!: FreightDataModel;
  loadSpinner: boolean = true;
  freightId: number = 0;
  //locations: any = [];
  sources: any = [];
  locationCode: string = '';
  vehcileSizes: any = [];
  destinations: any = [];
  getData: any = [];
  locationId!:Number;
  locations: any[] = APIConstant.commonLocationsList;
  commonLocations: any[] = [];
  freightList: any = [];
  freightLocationId: number = 0;
  nocFileBase64 : any = '';
  nocFileName: string = '';
  isFileUploaded: boolean = false;
  statusValue: string = '';
  locationsDropdownData: any = [];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private baseService: BaseService,
    private freightService: FreightService,
    private lookUpService: LookupService,
    private _Activatedroute: ActivatedRoute,
    private lookupService: LookupService) {
    this.freightForm = this.formBuilder.group({
      freightCode: [''],
      locationCode: [undefined, [Validators.required]],
      source: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      vehicleSize: ['', [Validators.required]],
      freightAmount: ['', [Validators.required]],
      status: [{ value: 'Inactive'}, [Validators.required]],
      matApproval: [''],
      matApprovalOn: [''],
      accApproval: [''],
      accApprovalOn: [''],
      remarks: [''],
      newFreightAmount: ['']
    });
  }

  ngOnInit(): void {
    this.getCommonLocations();
    this.getLocations();
    this.freightId = Number(this._Activatedroute.snapshot.paramMap.get("freightId"));
    this.freightId = this.freightId == 0 ? 0 : this.freightId;
    // this.baseService.lookupData.subscribe((res: any) => {
    //   this.locations = res.lookUps.filter((e: any) => e.code === 'LOC');
    // })
    if (this.freightId != 0) {
      this.getEditFreightData();
      this.loadSpinner = true;
    } else {
      this.loadSpinner = false;
    }

    this.getSourceDropdownData();
    this.getDestinationDropdownData();
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

  //FETCHING SELECTED FREIGHT'S DATA ON PAGE LOAD
  getFreightData(freightId: number) {
    this.loadSpinner = true;
    this.freightService.getFreightData(this.freightLocationId,freightId).subscribe((response: any) => {
      this.statusValue = response.status
      this.loadSpinner = false;
      this.locationCode = response.locations.value;
      this.freightForm.patchValue({
        freightCode: response.freightCode,
        locationCode: response.locations.id,
        source: response.sourceId,
        destination: response.destinationId,
        vehicleSize: response.vehicleSizeId,
        freightAmount: response.freightAmount,
        status: response.status,
        matApproval: response.approvedByMaterial,
        matApprovalOn: response.approvedByMaterialOn,
        accApproval: response.approvedByAccounts,
        accApprovalOn: response.approvedByAccountsOn,
        remarks: response.remarks,
        
      });
      this.checkApprovalStatus(response.approvedByMaterialAction, response.approvedByAccountsAction, response.NewFreightAmountStatus);

      this.loadSpinner = false;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  //FUNCTION TO HANDLE STATUS FIELD ON UPDATE
  checkApprovalStatus(approvedByMaterial: string, approvedByAccounts: string, NewFreightAmountStatus: string) {
    if (approvedByAccounts == null || approvedByMaterial == null || NewFreightAmountStatus ==  null ||
      approvedByMaterial.includes('Rejected') ||
      approvedByAccounts.includes('Rejected')) {
      this.freightForm.get('status')?.disable();
    } else {
      this.freightForm.get('status')?.enable();
    }
  }

  //FUNCTION EXECUTED ON SAVE BUTTON CLICK
  onPressSave() {
    this.loadSpinner = true;
    let data = {
      freightCode: this.freightForm.controls['freightCode'].value,
      locationCode: this.freightForm.controls['locationCode'].value,
      sourceId: (parseInt(this.freightForm.controls['source'].value)) || 0,
      destinationId: parseInt(this.freightForm.controls['destination'].value) || 0,
      vehicleSizeId: (parseInt(this.freightForm.controls['vehicleSize'].value)) || 0,
      freightAmount: parseInt(this.freightForm.controls['freightAmount'].value) || 0,
      status: this.freightForm.controls['status'].value,
      matApproval: null,
      matApprovalOn: null,
      accApproval: null,
      accApprovalOn: null,
      remarks: this.freightForm.controls['remarks'].value,
      actionBy: localStorage.getItem("userId"),
      fileName: this.nocFileName,
      fileData: this.nocFileBase64,
      newFreightAmount: parseInt(this.freightForm.controls['newFreightAmount'].value) || 0,
    }
    if (this.freightId > 0) {
      this.updateFreight(data);
    } else {
      this.createNewFreight(data);
    }
  }

  //UPDATING FREIGHT DATA
  updateFreight(data: any) {
    const locationCode = this.freightForm.controls['locationCode']?.value
    this.freightService.updateFreight(locationCode,this.freightId, data).subscribe((response: any) => {
      this.freightData = response;
      this.toastr.success('Freight Updated Successfully');
      this.router.navigate(['/master/freight']);
      this.loadSpinner = false;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  //CREATING NEW FREIGHT
  createNewFreight(data: any) {
    const locationCode = this.freightForm.controls['locationCode']?.value
    this.freightService.createFreight(locationCode,data).subscribe((response: any) => {
      this.loadSpinner = false;
      this.toastr.success('Freight Created Successfully');
      this.router.navigate(['/master/freight'])
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  //REDIRECTING USER BACK TO FREIGHT LISTING SCREEN
  onCancelPress() {
    this.router.navigate(['master/freight']);
  }

  getSourceDropdownData() {
    let data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'Source'
    this.freightService.getDropdownData(data, type).subscribe((res: any) => {
      this.sources = res.lookUps.filter(
        (item: any) => item.status === 'Active')
    })
  }

  getDestinationDropdownData() {
    let data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'Destination'
    this.freightService.getDropdownData(data, type).subscribe((res: any) => {
      this.destinations = res.lookUps.filter(
        (item: any) => item.status === 'Active')
    })
  }

  getVehicleSizeDropdownData() {
    let data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'VehicleSize'
    this.freightService.getDropdownData(data, type).subscribe((res: any) => {
      this.vehcileSizes = res.lookUps.filter(
        (item: any) => item.status === 'Active')
    })
  }

  setLocation(){
    if(!this.freightId){
      this.lookUpService.setLocationId(this.freightForm, this.commonLocations, 'locationCode');
    }
  }

  getEditFreightData() {
    let data = {
      "locationIds": APIConstant.commonLocationsList.map((e:any)=>(e.id)),
      "screenCode": 101,
      "freightCode": "",
      "source": "",
      "destination": "",
      "vehicleSize": ""
    }
    this.freightService.getFreightsList(data).subscribe((response: any) => {
      this.freightList = response.freights;
      this.getLocationId().then(() => {
        this.getFreightData(this.freightId);
      });
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
    })
  }

  getLocationId(): Promise<void> {
    return new Promise((resolve, reject) => {
      const freight = this.freightList.filter((freight: any) => {
        return freight.id == this.freightId
      });
      if (freight.length > 0) {
        this.freightLocationId = freight[0].locations.id;
        resolve();
      } else {
        reject('No matching freight found');
      }
    });
  }

  
  onUploadPdf(evt: any) {
    const file = evt.target.files[0];
    const maxSizeInBytes = 5 * 1024 * 1024;
  
    if (file.size > maxSizeInBytes) {
      this.toastr.error('File size should be less than 5MB', 'Error');
      this.isFileUploaded = false;
      return;
    }
  
    this.nocFileName = file.name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result;
      this.nocFileBase64 = base64String;
      this.toastr.success('PDF Added', 'Success');
      this.isFileUploaded = true;
    };
  }

  onChangeStatus(event: any){
    this.statusValue = event?.target?.value;
  }
  
}
