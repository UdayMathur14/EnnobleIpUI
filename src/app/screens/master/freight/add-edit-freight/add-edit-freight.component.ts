import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FreightService } from '../../../../core/service/freight.service';
import { BaseService } from '../../../../core/service/base.service';
import { FreightDataModel } from '../../../../core/model/masterModels.model';

@Component({
  selector: 'app-add-edit-freight',
  templateUrl: './add-edit-freight.component.html',
  styleUrl: './add-edit-freight.component.scss'
})
export class AddEditFreightComponent implements OnInit {
  freightForm: FormGroup;
  freightData!: FreightDataModel;
  loadSpinner: boolean = true;
  queryData: any = '';
  locations: any = [];
  sources: any = [];
  locationCode: string = '';
  vehcileSizes: any = [];
  destinations: any = [];
  constructor(private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private baseService: BaseService,
    private freightService: FreightService,
    private _Activatedroute: ActivatedRoute) {
    this.freightForm = this.formBuilder.group({
      freightCode: ['', Validators.required],
      locationCode: [undefined, [Validators.required]],
      source: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      vehicleSize: ['', [Validators.required]],
      freightAmount: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
      matApproval: [''],
      matApprovalOn: [''],
      accApproval: [''],
      accApprovalOn: [''],
      remarks: [''],
    });
  }

  ngOnInit(): void {
    this.queryData = this._Activatedroute.snapshot.paramMap.get("freightId");
    this.queryData = this.queryData == 0 ? '' : this.queryData;
    this.baseService.lookupData.subscribe((res: any) => {
      this.locations = res.lookUps.filter((e: any) => e.code === 'LOC');
    })
    if (this.queryData != 0) {
      this.getFreightData(this.queryData);
    }
    this.loadSpinner = false;

    // Enable or disable status control based on queryData for Create and Update
    const statusControl = this.freightForm.get('status');
    if (statusControl) {
      if (this.queryData) {
        statusControl.enable();
      } else {
        statusControl.disable();
      }
    }
    this.getSourceDropdownData();
    this.getDestinationDropdownData();
    this.getVehicleSizeDropdownData();
  }

  //FETCHING SELECTED FREIGHT'S DATA ON PAGE LOAD
  getFreightData(freightId: string) {
    this.freightService.getFreightData(freightId).subscribe((response: any) => {
      this.locationCode = response.locations.value;
      this.freightForm.patchValue({
        freightCode: response.freightCode,
        locationCode: response.locations.value,
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
      freightCode: this.freightForm.controls['freightCode'].value,
      locationCode: this.freightForm.controls['locationCode'].value,
      // source:this.freightForm.controls['source'].value,
      sourceId: parseInt( this.freightForm.controls['source'].value),
      destinationId: parseInt(this.freightForm.controls['destination'].value),
      vehicleSizeId: parseInt(this.freightForm.controls['vehicleSize'].value),
      freightAmount: this.freightForm.controls['freightAmount'].value,
      status: this.freightForm.controls['status'].value,
      matApproval: this.freightForm.controls['matApproval'].value,
      matApprovalOn: this.freightForm.controls['matApprovalOn'].value,
      accApproval: this.freightForm.controls['accApproval'].value,
      accApprovalOn: this.freightForm.controls['accApprovalOn'].value,
      remarks: this.freightForm.controls['remarks'].value,
    }
    if (this.queryData) {
      this.updateFreight(data);
    } else {
      this.createNewFreight(data);
    }
  }

  //UPDATING FREIGHT DATA
  updateFreight(data: any) {
    this.freightService.updateFreight(this.queryData, data).subscribe((response: any) => {
      this.freightData = response;
      this.loadSpinner = false;
      this.toastr.success('Freight Updated Successfully');
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

  //CREATING NEW FREIGHT
  createNewFreight(data: any) {
    this.freightService.createFreight(data).subscribe((response: any) => {
      this.loadSpinner = false;
      this.toastr.success('Freight Created Successfully');
      this.router.navigate(['/master/freight'])
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

  //REDIRECTING USER BACK TO FREIGHT LISTING SCREEN
  onCancelPress() {
    this.router.navigate(['master/freight']);
  }

  getSourceDropdownData(){
    let data = {
      "CreatedOn": "",
      "ModifiedBy": "",
      "ModifiedOn": ""
    }
    const type = 'Source'
    this.freightService.getDropdownData(data, type).subscribe((res:any)=>{
      this.sources = res.lookUps
    })
  }

  getDestinationDropdownData(){
    let data = {
      "CreatedOn": "",
      "ModifiedBy": "",
      "ModifiedOn": ""
    }
    const type = 'Destination'
    this.freightService.getDropdownData(data, type).subscribe((res:any)=>{
      this.destinations = res.lookUps
    })
  }

  getVehicleSizeDropdownData(){
    let data = {
      "CreatedOn": "",
      "ModifiedBy": "",
      "ModifiedOn": ""
    }
    const type = 'VehicleSize'
    this.freightService.getDropdownData(data, type).subscribe((res:any)=>{
      this.vehcileSizes = res.lookUps
    })
  }
}
