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
      footer: ['']
    });
  }

  ngOnInit(): void {
    this.queryData = this._Activatedroute.snapshot.paramMap.get("transporterCode");
    this.queryData = this.queryData == 0 ? '' : this.queryData;
    if (this.queryData != 0) {
      this.getTransporterData(this.queryData);
    }
    this.loadSpinner = false;
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
        // rcmNonRcm : response,
        autoBiltiCharactor : response.autoBiltiStartingCharacter,
        consignorName : response.consignorName,
        regdDetails : response.regdDetails,
        // modeOfTransport : response,
        biltiHeaderComment : response.biltiHeaderComments,
        note : response.note,
        footer : response.footer
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
        actionBy: 0,
        attribute1: "",
        attribute2: "",
        attribute3: "",
        attribute4: "",
        attribute5: 0,
        attribute6: 0,
        attribute7: 0,
        attribute8: 0,
        attribute9: "2024-04-05T04:39:05.722Z",
        attribute10: "2024-04-05T04:39:05.722Z",
        locationId: this.transporterForm.controls['locationCode'].value,
        transporterCode: this.transporterForm.controls['transporterCode'].value,
        transporterName: this.transporterForm.controls['transporterName'].value,
        ownerName: this.transporterForm.controls['ownerName'].value,
        contactPerson: this.transporterForm.controls['contactPerson'].value,
        transporterAddress1: this.transporterForm.controls['address1'].value,
        transporterAddress2: this.transporterForm.controls['address2'].value,
        cityId: 0,
        stateId: 0,
        countryId: 0,
        postalCode: "",
        panNo: this.transporterForm.controls['pan'].value,
        gstnNo: this.transporterForm.controls['gst'].value,
        transporterContactNo: this.transporterForm.controls['contactNumber'].value,
        transporterMailId: "",
        regdDetails: this.transporterForm.controls['regdDetails'].value,
        autoBiltiRequiredFlag: this.transporterForm.controls['autoBiltiReq'].value,
        autoBiltiStartingCharacter: this.transporterForm.controls['autoBiltiCharactor'].value,
        consignorName: this.transporterForm.controls['consignorName'].value,
        consignorContactInformation: this.transporterForm.controls['consignorContactInfo'].value,
        biltiHeaderComments: this.transporterForm.controls['biltiHeaderComment'].value,
        note: this.transporterForm.controls['note'].value,
        footer: this.transporterForm.controls['footer'].value,
        modifiedBy: ""
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
}