import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransporterService } from '../../../../core/service/transporter.service';

@Component({
  selector: 'app-add-edit-transporter',
  templateUrl: './add-edit-transporter.component.html',
  styleUrl: './add-edit-transporter.component.scss'
})
export class AddEditTransporterComponent implements OnInit {
  transporterForm: FormGroup;
  queryData: any;
  loadSpinner: boolean = true;
  transportMode: any = [];

  constructor(private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _Activatedroute: ActivatedRoute,
    private transporterService: TransporterService) {
    this.transporterForm = this.formBuilder.group({
      transporterCode: ['', Validators.required],
      transporterName: ['', [Validators.required]],
      locationCode: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
      ownerName: ['', [Validators.required]],
      contactPerson: ['', [Validators.required]],
      address1: [''],
      address2: [''],
      contactNumber: [''],
      pan: [''],
      gst: [''],
      autoBiltiReq: [''],
      consignorContactInfo: [''],
      rcmNonRcm: [''],
      autoBiltiCharactor: [''],
      consignorName: [''],
      regdDetails: [''],
      modeOfTransport: [''],
      biltiHeaderComment: [''],
      note: [''],
      footer: [''],
      transporterMailId: [''],
      postalCode: [''],
    });
  }

  ngOnInit(): void {
    this.queryData = this._Activatedroute.snapshot.paramMap.get("transporterCode");
    this.queryData = this.queryData == 0 ? '' : this.queryData;
    if (this.queryData != 0) {
      this.getTransporterData(this.queryData);
    }
    this.loadSpinner = false;
      // Enable or disable status control based on queryData for Create and Update
      const statusControl = this.transporterForm.get('rcmNonRcm');
      if(statusControl){
        if(this.queryData != 0){
          statusControl.disable()
        }
      }
      this.getTransporterModeDropdownData();
  }

  getTransporterData(transporterId:string){
    this.transporterService.getTransporterData(transporterId).subscribe((response: any) => {
      this.transporterForm.patchValue({
        transporterCode : response.transporterCode,
        transporterName : response.transporterName,
        locationCode : response.locationId,
        status : response.status,
        ownerName : response.ownerName,
        contactPerson : response.contactPerson,
        address1 : response.transporterAddress1,
        address2 : response.transporterAddress2,
        contactNumber : response.transporterContactNo,
        pan : response.panNo,
        gst : response.gstnNo,
        autoBiltiReq : response.autoBiltiRequiredFlag,
        consignorContactInfo : response.consignorContactInformation,
        rcmNonRcm : response.rcmFlag,
        autoBiltiCharactor : response.autoBiltiStartingCharacter,
        consignorName : response.consignorName,
        regdDetails : response.regdDetails,
        modeOfTransport : response.transporterMode.value,
        biltiHeaderComment : response.biltiHeaderComments,
        note : response.note,
        footer : response.footer,
        transporterMailId: response.transporterMailId,
        postalCode: response.postalCode
      });
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

    //FUNCTION EXECUTED ON SAVE BUTTON CLICK
    onSavePress() {
      this.loadSpinner = true;
      let data = {
        status: this.transporterForm.controls['status'].value,
        actionBy: 1,
        transporterName: this.transporterForm.controls['transporterName'].value,
        ownerName: this.transporterForm.controls['ownerName'].value,
        contactPerson: this.transporterForm.controls['contactPerson'].value,
        transporterAddress1: this.transporterForm.controls['address1'].value,
        transporterAddress2: this.transporterForm.controls['address2'].value,
        cityId: 1,
        stateId: 1,
        countryId: 1,
        postalCode: this.transporterForm.controls['postalCode'].value,
        transporterContactNo: this.transporterForm.controls['contactNumber'].value,
        transporterMailId: this.transporterForm.controls['transporterMailId'].value,
        regdDetails: this.transporterForm.controls['regdDetails'].value,
        autoBiltiRequiredFlag: this.transporterForm.controls['autoBiltiReq'].value,
        autoBiltiStartingCharacter: this.transporterForm.controls['autoBiltiCharactor'].value,
        consignorContactInformation: this.transporterForm.controls['consignorContactInfo'].value,
        biltiHeaderComments: this.transporterForm.controls['biltiHeaderComment'].value,
        rcmFlag: this.transporterForm.controls['rcmNonRcm'].value,
        transportationModeId: parseInt(this.transporterForm.controls['modeOfTransport'].value),
        note: this.transporterForm.controls['note'].value,
        footer: this.transporterForm.controls['footer'].value,
      }
      if(this.queryData){
        this.updateTransporter(data);
      }
       else{
        this.createNewTransporter(data);
      }
    }
  
    //UPDATING TRANSPORTER DATA
    updateTransporter(data:any){
      this.transporterService.updateTransporter(this.queryData, data).subscribe((response: any) => {
        this.loadSpinner = false;
        this.toastr.success('Transporter Updated Successfully');
      }, error => {
        this.toastr.error(error.statusText, error.status);
        this.loadSpinner = false;
      })
    }
  
    //CREATING NEW TRANSPORTER
    createNewTransporter(data:any){

    }

  onCancelPress() {
    this.router.navigate(['/master/transporter'])
  }

  getTransporterModeDropdownData(){
    let data = {
      "CreatedOn": "",
      "ModifiedBy": "",
      "ModifiedOn": ""
    }
    const type = 'TransporterMode'
    this.transporterService.getDropdownData(data, type).subscribe((res:any)=>{
      this.transportMode = res.lookUps
    })
  }
}