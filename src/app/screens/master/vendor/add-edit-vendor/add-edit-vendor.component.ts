import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorService } from '../../../../core/service/vendor.service';
import { VendorDataModel } from '../../../../core/model/masterModels.model';
import { ToastrService } from 'ngx-toastr';
import { PointChargeService } from '../../../../core/service/point-charge.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-vendor',
  templateUrl: './add-edit-vendor.component.html',
  styleUrl: './add-edit-vendor.component.scss'
})
export class AddEditVendorComponent implements OnInit {
  constructor(
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    private vendorService: VendorService,
    private pointChargeService: PointChargeService,
    private toastr: ToastrService,
  ) { }

  vendorForm = new FormGroup({
    vendorCode: new FormControl(''),
    vendorName: new FormControl(''),
    vendorAddress: new FormControl(''),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/)]),
    city: new FormControl(''),
    state: new FormControl(''),
    pan: new FormControl(''),
    gstin: new FormControl(''),
    paymentTermCode: new FormControl(''),
    paymentStatus: new FormControl(''),
    paidByDetail: new FormControl(''),
    taxationCode: new FormControl('', [Validators.required]),
    cgst: new FormControl(''),
    sgst: new FormControl(''),
    igst: new FormControl(''),
    rcmNonRcm: new FormControl(''),
    status: new FormControl('')
  });
  queryData: any;
  vendorData: VendorDataModel = {};
  vendorsList: any = [];
  loadSpinner: boolean = true;
  pointChargeName: any = [];
  selectedPointName: undefined;
  taxationCode: any;
  paidbyDetailsList:any = [];
  disableSubmit : boolean = false;
  paidByDetailId: number | null = null;
  ngOnInit(): void {
    this.loadSpinner = true;
    this.queryData = this._Activatedroute.snapshot.paramMap.get("vendorId");
    this.getVendorData(this.queryData);
    this.getAllPointChargesList();
    this.getTaxationCodeDropdownData();
    this.getAllPaidByDetails();
    this.vendorForm.get('paidByDetail')?.valueChanges.subscribe(value => {
      const selectedDetail = this.paidbyDetailsList.find((detail: any) => detail.value === value);
      if (selectedDetail) {
        this.paidByDetailId = selectedDetail.id;
      }
    });
  }

  //TO GET THE VENDOR DATA
  getVendorData(vendorId: string) {
    this.vendorService.getVendorData(vendorId).subscribe((response: any) => {
      this.paidByDetailId = response.paidByDetail.id;
      this.patchVendorData(response)
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  //TO GET THE POINT NAME FROM POINT CHARGE 
  getAllPointChargesList() {
    let data = {}
    this.pointChargeService.getPointCharges(data).subscribe((response: any) => {
      this.pointChargeName = response.pointCharges;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  //UPDATING THE VENDOR ON CLICK OF SAVE BUTTON
  onPressSave() {
    this.loadSpinner = true;
    const rcmNonRcmValue = this.vendorForm.get('rcmNonRcm')?.value === 'RCM' ? 1 : 0;
    let data = {
      "actionBy": 1,
      "contactNumber": this.vendorForm.get('phone')?.value,
      "email": this.vendorForm.get('email')?.value,
      "status": this.vendorForm.get('status')?.value,
      "taxationTypeId": (this.vendorForm.get('taxationCode')?.value) || 0,
      "attribute5": this.vendorForm.get('cgst')?.value,
      "attribute6": this.vendorForm.get('sgst')?.value,
      "attribute7": this.vendorForm.get('igst')?.value,
      "attribute8": rcmNonRcmValue,
      "paidByDetailId": Number(this.paidByDetailId)
    }
    this.vendorService.updateVendor(this.queryData, data).subscribe((response: any) => {
      this.vendorData = response;
      this.toastr.success("Vendor Update Successfully");
      this.router.navigate(['master/vendor']);
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  getTaxationCodeDropdownData() {
    let data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'taxationCode'
    this.vendorService.getDropdownData(data, type).subscribe((res: any) => {
      this.taxationCode = res.lookUps
    })
  }

  //NAVIGATION BACK TO VENDOR LISTING ON CLICK CANCEL BUTTON
  onCancelPress() {
    this.router.navigate(['master/vendor']);
  }

  patchVendorData(data: any) {
    this.vendorForm.patchValue({
      vendorCode: data.vendorCode,
      vendorName: data.vendorName,
      vendorAddress: data.vendorAddress1,
      phone: data.contactNumber,
      email: data.email,
      city: data.city.value,
      state: data.state.value,
      pan: data.panNo,
      gstin: data.gstnNo,
      paymentTermCode: data.payTermCode,
      paymentStatus: data.payTermStatus,
      paidByDetail: data.paidByDetail.value,
      taxationCode: data.taxationType.id,
      cgst: data.attribute5,
      sgst: data.attribute6,
      igst: data.attribute7,
      status: data.status,
      rcmNonRcm: data.taxationType.attribute8 === 1 ? 'RCM' : 'Non RCM' || '',
    });
  }


  onOptionSelected(event: any) {
    const selectedLookup = this.taxationCode.find((lookup: any) => lookup.id === event);
    this.vendorForm.patchValue({
      cgst: selectedLookup.attribute5,
      sgst: selectedLookup.attribute6,
      igst: selectedLookup.attribute7,
      rcmNonRcm: selectedLookup.attribute8 === 1 ? 'RCM' : 'Non RCM' || ''
    });

  }

  validateNo(e:any){
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false
    }
    return true;
  }

  phoneNumberLength(e:any){
    const phoneControl = this.vendorForm.get('phone');
    if (phoneControl?.value) {
    this.disableSubmit = phoneControl.value.length < 10 ? true : false;
    }
  }

  getAllPaidByDetails() {
    let data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'PaidByDetails'
    this.vendorService.getDropdownData(data,type).subscribe((response:any) => {
      this.paidbyDetailsList = response.lookUps;
      
    }, error => {
      this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
    })
  }

}
