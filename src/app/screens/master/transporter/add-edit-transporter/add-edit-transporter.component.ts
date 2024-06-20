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
  taxationCode: any;
  disableSubmit: boolean = false;

  constructor(private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _Activatedroute: ActivatedRoute,
    private transporterService: TransporterService) {
    this.transporterForm = this.formBuilder.group({
      transporterCode: [''],
      transporterName: [''],
      locationCode: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
      ownerName: [''],
      contactPerson: [''],
      address1: [''],
      address2: [''],
      contactNumber: ['', [Validators.required]],
      pan: [''],
      gst: [''],
      autoBiltiReq: ['', [Validators.required]],
      consignorContactInfo: [''],
      autoBiltiCharactor: [''],
      consignorName: [''],
      regdDetails: [''],
      modeOfTransport: [],
      biltiHeaderComment: ['', [Validators.required]],
      note: ['', [Validators.required]],
      footer: ['', [Validators.required]],
      transporterMailId: ['', Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/
      )],
      postalCode: [''],
      taxationCode: [],
      rcmNonRcm: [''],
      sgst: [''],
      cgst: [''],
      igst: [''],
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
    this.getTransporterModeDropdownData();
    this.getTaxationcode();
  }

  getTransporterData(transporterId: string) {
    this.transporterService.getTransporterData(transporterId).subscribe((response: any) => {
      this.transporterForm.patchValue({
        transporterCode: response.transporterCode,
        transporterName: response.transporterName,
        locationCode: response.locations.value,
        status: response.status,
        ownerName: response.ownerName,
        contactPerson: response.contactPerson,
        address1: response.transporterAddress1,
        address2: response.transporterAddress2,
        contactNumber: response.transporterContactNo,
        pan: response.panNo,
        gst: response.gstnNo,
        autoBiltiReq: response.autoBiltiRequiredFlag,
        consignorContactInfo: response.consignorContactInformation,
        rcmNonRcm: response.taxationType.attribute8 === 1 ? 'RCM' : 'Non RCM' || '',
        autoBiltiCharactor: response.autoBiltiStartingCharacter,
        consignorName: response.consignorName,
        regdDetails: response.regdDetails,
        modeOfTransport: response.transporterMode.id,
        biltiHeaderComment: response.biltiHeaderComments,
        note: response.note,
        footer: response.footer,
        transporterMailId: response.transporterMailId,
        postalCode: response.postalCode,
        cgst: response.taxationType.attribute5,
        sgst: response.taxationType.attribute6,
        igst: response.taxationType.attribute7,
        taxationCode: response.taxationType.id
      });
      this.loadSpinner = false;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  //FUNCTION EXECUTED ON SAVE BUTTON CLICK
  onSavePress() {
    this.loadSpinner = true;
    const data = {
      status: this.transporterForm.controls['status'].value,
      actionBy: localStorage.getItem("userId"),
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
      transportationModeId: this.transporterForm.controls['modeOfTransport'].value || 0,
      note: this.transporterForm.controls['note'].value,
      footer: this.transporterForm.controls['footer'].value,
      taxationTypeId: this.transporterForm.controls['taxationCode'].value || 0,
    }
    if (this.queryData) {
      this.updateTransporter(data);
    }
    else {
      this.createNewTransporter(data);
    }
  }

  //UPDATING TRANSPORTER DATA
  updateTransporter(data: any) {
    this.transporterService.updateTransporter(this.queryData, data).subscribe((response: any) => {
      this.loadSpinner = false;
      this.toastr.success('Transporter Updated Successfully');
      this.router.navigate(['/master/transporter']);
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  //CREATING NEW TRANSPORTER
  createNewTransporter(data: any) {

  }

  onCancelPress() {
    this.router.navigate(['/master/transporter'])
  }

  getTransporterModeDropdownData() {
    const data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'TransporterMode'
    this.transporterService.getDropdownData(data, type).subscribe((res: any) => {
      this.transportMode = res.lookUps
    })
  }

  getTaxationcode() {
    const data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'taxationCode'
    this.transporterService.getDropdownData(data, type).subscribe((res: any) => {
      this.taxationCode = res.lookUps
    })
  }

  onOptionSelected(event: any) {
    const selectedLookup = this.taxationCode.find((lookup: any) => lookup.id === event);
    this.transporterForm.patchValue({
      cgst: selectedLookup.attribute5,
      sgst: selectedLookup.attribute6,
      igst: selectedLookup.attribute7,
      rcmNonRcm: selectedLookup.attribute8 === 1 ? 'RCM' : 'Non RCM' || ''
    });

  }

  validateNo(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false
    }
    return true;
  }

  phoneNumberLength(e: any) {
    this.disableSubmit = this.transporterForm.get('contactNumber')?.value.length < 10 ? true : false;
  }
}