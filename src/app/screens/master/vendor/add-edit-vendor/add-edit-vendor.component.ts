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
    email: new FormControl('', [Validators.required]),
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
  taxationCode: any
  ngOnInit(): void {
    this.loadSpinner = true;
    this.queryData = this._Activatedroute.snapshot.paramMap.get("vendorId");
    this.getVendorData(this.queryData);
    this.getAllPointChargesList();
    this.getTaxationCodeDropdownData();
  }

  //TO GET THE VENDOR DATA
  getVendorData(vendorId: string) {
    this.vendorService.getVendorData(vendorId).subscribe((response: any) => {
      this.patchVendorData(response)
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
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
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

  //UPDATING THE VENDOR ON CLICK OF SAVE BUTTON
  onPressSave() {
    this.loadSpinner = true;
    let data = {
      "actionBy": 1,
      "contactNumber": this.vendorForm.get('phone')?.value,
      "email": this.vendorForm.get('email')?.value,
      "status": this.vendorForm.get('status')?.value,
      "taxationTypeId": this.vendorForm.get('taxationCode')?.value,
    }
    this.vendorService.updateVendor(this.queryData, data).subscribe((response: any) => {
      this.vendorData = response;
      this.toastr.success("Vendor Update Successfully");
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
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
      console.log(res)
      this.taxationCode = res.lookUps
    })
  }

  //NAVIGATION BACK TO VENDOR LISTING ON CLICK CANCEL BUTTON
  onCancelPress() {
    this.router.navigate(['master/vendor']);
  }

  patchVendorData(data: any) {
    console.log(data)
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
      cgst: data.taxationType.attribute5,
      sgst: data.taxationType.attribute6,
      igst: data.taxationType.attribute7,
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

  // Custom keypress event handler for phone input field
  // Allow only numeric characters and limit to 10 characters
  onPhoneKeyPress(event: KeyboardEvent) {
    const allowedCharacters = /^[0-9]$/;
    const phoneControl = this.vendorForm.get('phone');
    if (phoneControl?.value && phoneControl?.value.length >= 10 || !allowedCharacters.test(event.key)) {
      event.preventDefault();
    }
  }

}
