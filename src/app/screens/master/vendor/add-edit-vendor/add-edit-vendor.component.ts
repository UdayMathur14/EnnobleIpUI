import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorService } from '../../../../core/service/vendor.service';
import {
  TransporterDataModel,
  VendorDataModel,
} from '../../../../core/model/masterModels.model';
import { ToastrService } from 'ngx-toastr';
import { PointChargeService } from '../../../../core/service/point-charge.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TransactionTypesService } from '../../../../core/service/transactionTypes.service';
import { LookupService } from '../../../../core/service/lookup.service';

@Component({
  selector: 'app-add-edit-vendor',
  templateUrl: './add-edit-vendor.component.html',
  styleUrl: './add-edit-vendor.component.scss',
})
export class AddEditVendorComponent implements OnInit {
  queryData: any;
  vendorId : number = 0;
  vendorData: VendorDataModel = {};
  vendorsList: any = [];
  loadSpinner: boolean = true;
  pointChargeName: any = [];
  selectedPointName: undefined;
  taxationCode: any;
  paidbyDetailsList: any = [];
  disableSubmit: boolean = false;
  paidByDetailId: number | null = null;
  transporterData!: TransporterDataModel;
  transactionMappings: any[] = [];
  transporterMode: any[] = [];
  rcmNonRcmType: any[] = [];
  taxCodes: any = [];
  tdsCodes: any[] = [];
  paidByDetails: any[] = [];
  transactionTypes: any[] = [];
  selectedTransactionTypes: Set<string> = new Set();
  isShow: boolean = false;
  freightCity: any = [];
  statusValue: string = '';
  vendorForm = new FormGroup({
    vendorType: new FormControl('', Validators.required),
    vendorCode: new FormControl('', Validators.required),
    vendorName: new FormControl('', Validators.required),
  
    billingAddressLine1: new FormControl(''),
    billingAddressLine2: new FormControl(''),
    billingCity: new FormControl(''),
    billingState: new FormControl(''),
    billingCountry: new FormControl(''),
    billingPinCode: new FormControl('', [
      Validators.pattern(/^[0-9]{6}$/) // optional: only if 6-digit PIN
    ]),
  
    shippingAddressLine1: new FormControl(''),
    shippingAddressLine2: new FormControl(''),
    shippingCity: new FormControl(''),
    shippingState: new FormControl(''),
    shippingCountry: new FormControl(''),
    shippingPinCode: new FormControl('', [
      Validators.pattern(/^[0-9]{6}$/)
    ]),
  
    pan: new FormControl('', [
      Validators.pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/) // optional PAN format
    ]),
    gst: new FormControl('', [
      Validators.pattern(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/) // optional GST format
    ]),
    gstTreatment: new FormControl(''),
    msmeRegistered: new FormControl(true),
    msmeType: new FormControl(''),
    msmeNo: new FormControl(''),
  
    contactPersonName: new FormControl('',Validators.required),
    designation: new FormControl(''),
  
    email1: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    email2: new FormControl('', Validators.email),
  
    phoneMobileNo: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[6-9]\d{9}$/) // Indian mobile number pattern
    ]),
  
    currency: new FormControl(''),
    paymentTerms: new FormControl(''),
  
    bankName: new FormControl(''),
    accountHolderName: new FormControl(''),
    accountNumber: new FormControl('', [
      Validators.pattern(/^\d{9,18}$/)
    ]),
    confirmAccountNumber: new FormControl('', [
      Validators.pattern(/^\d{9,18}$/)
    ]),
    ifscCode: new FormControl('', [
      Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)
    ]),
    swiftCode: new FormControl(''),
  
    bankAddressLine1: new FormControl(''),
    bankAddressLine2: new FormControl(''),
    branch: new FormControl(''),
    bankCity: new FormControl(''),
    bankState: new FormControl(''),
    bankPinCode: new FormControl('', [
      Validators.pattern(/^[0-9]{6}$/)
    ]),
  
    status: new FormControl('', Validators.required)
  });
  

  constructor(
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    private vendorService: VendorService,
    private pointChargeService: PointChargeService,
    private toastr: ToastrService,
    private transactionTypeService: TransactionTypesService,
    private lookupService: LookupService,
  ) {}

  ngOnInit(): void {
    this.loadSpinner = true;
    this.queryData = this._Activatedroute.snapshot.paramMap.get('vendorId');
    this.vendorId = Number(this._Activatedroute.snapshot.paramMap.get("vendorId")) || 0;
    this.getVendorData(this.queryData);
    // this.getAllPointChargesList();
    // this.getTaxationCodeDropdownData();
    // this.getPaidByDetailsDropdownData();
    // this.getTransactionTypes();
    // this.getRCMNonRCMTypeDropdownData();
    // this.getTdsCodesDropdownData();
    // this.getFreightCity();
    this.vendorForm.get('paidByDetail')?.valueChanges.subscribe((value) => {
      const selectedDetail = this.paidbyDetailsList.find(
        (detail: any) => detail.value === value
      );
      if (selectedDetail) {
        this.paidByDetailId = selectedDetail.id;
      }
    });
  }

  //TO GET THE VENDOR DATA
  getVendorData(vendorId: string) {
    this.vendorService.getVendorData(vendorId).subscribe(
      (response: any) => {
        this.paidByDetailId = response.paidByDetail?.id;
        this.patchVendorData(response);
        this.loadSpinner = false;
      },
      (error) => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  //TO GET THE POINT NAME FROM POINT CHARGE
  getAllPointChargesList() {
    let data = {};
    this.pointChargeService.getPointCharges(data).subscribe(
      (response: any) => {
        this.pointChargeName = response.pointCharges;
        this.loadSpinner = false;
      },
      (error) => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  //UPDATING THE VENDOR ON CLICK OF SAVE BUTTON
  onPressSave() {
    this.loadSpinner = true;
    const data = {
      actionBy: "",
      vendorType: this.vendorForm.get('vendorType')?.value,
      vendorCode: this.vendorForm.get('vendorCode')?.value,
      vendorName: this.vendorForm.get('vendorName')?.value,
      billingAddressLine1: this.vendorForm.get('billingAddressLine1')?.value,
      billingAddressLine2: this.vendorForm.get('billingAddressLine2')?.value,
      billingCity: this.vendorForm.get('billingCity')?.value,
      billingState: this.vendorForm.get('billingState')?.value,
      billingCountry: this.vendorForm.get('billingCountry')?.value,
      billingPinCode: this.vendorForm.get('billingPinCode')?.value,
      shippingAddressLine1: this.vendorForm.get('shippingAddressLine1')?.value,
      shippingAddressLine2: this.vendorForm.get('shippingAddressLine2')?.value,
      shippingCity: this.vendorForm.get('shippingCity')?.value,
      shippingState: this.vendorForm.get('shippingState')?.value,
      shippingCountry: this.vendorForm.get('shippingCountry')?.value,
      shippingPinCode: this.vendorForm.get('shippingPinCode')?.value,
      pan: this.vendorForm.get('pan')?.value,
      gst: this.vendorForm.get('gst')?.value,
      gstTreatment: this.vendorForm.get('gstTreatment')?.value,
      msmeRegistered: this.vendorForm.get('msmeRegistered')?.value,
      msmeType: this.vendorForm.get('msmeType')?.value,
      msmeNo: this.vendorForm.get('msmeNo')?.value,
      contactPersonName: this.vendorForm.get('contactPersonName')?.value,
      designation: this.vendorForm.get('designation')?.value,
      email1: this.vendorForm.get('email1')?.value,
      email2: this.vendorForm.get('email2')?.value,
      phoneMobileNo: this.vendorForm.get('phoneMobileNo')?.value,
      currency: this.vendorForm.get('currency')?.value,
      paymentTerms: this.vendorForm.get('paymentTerms')?.value,
      bankName: this.vendorForm.get('bankName')?.value,
      accountHolderName: this.vendorForm.get('accountHolderName')?.value,
      accountNumber: this.vendorForm.get('accountNumber')?.value,
      confirmAccountNumber: this.vendorForm.get('confirmAccountNumber')?.value,
      ifscCode: this.vendorForm.get('ifscCode')?.value,
      swiftCode: this.vendorForm.get('swiftCode')?.value,
      bankAddressLine1: this.vendorForm.get('bankAddressLine1')?.value,
      bankAddressLine2: this.vendorForm.get('bankAddressLine2')?.value,
      branch: this.vendorForm.get('branch')?.value,
      bankCity: this.vendorForm.get('bankCity')?.value,
      bankState: this.vendorForm.get('bankState')?.value,
      bankPinCode: this.vendorForm.get('bankPinCode')?.value,
      status: this.vendorForm.get('status')?.value
    };
    
    if(this.vendorId==0){
      this.loadSpinner = true;
      this.vendorService.createVendor(data).subscribe((response: any) => {
        this.vendorData = response;
        this.loadSpinner = false;
        this.toastr.success('Vendor Created Successfully');
        this.router.navigate(['/master/vendor'])
      }, () => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    )
    }
    else{
    this.vendorService.updateVendor(this.queryData, data).subscribe(
      (response: any) => {
        this.vendorData = response;
        this.toastr.success('Vendor Update Successfully');
        this.router.navigate(['master/vendor']);
        this.loadSpinner = false;
      },
      (error) => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
      
    );
  }
  }
  


  getTransactionTypes() {
    const data = {
      transactionTypeCode: '',
      transactionTypeName: '',
      glSubCategory: '',
      status: '',
    };

    this.transactionTypeService
      .getTransactionTypes(data)
      .subscribe((res: any) => {
        this.transactionTypes = res?.transactionTypes.filter((type: any) => type.code.toLowerCase() !== 'rtv-rb' && type.code.toLowerCase() !== 'invoice-rb');
      });
  }

  getTaxationCodeDropdownData() {
    let data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'taxationCode';
    this.vendorService.getDropdownData(data, type).subscribe((res: any) => {
      this.taxationCode = res.lookUps.filter(
        (item: any) => item.status === 'Active');
    });
  }
  getPaidByDetailsDropdownData() {
    let data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'PaidByDetails';
    this.vendorService.getDropdownData(data, type).subscribe((res: any) => {
      this.paidByDetails = res.lookUps.filter(
        (item: any) => item.status === 'Active');
    });
  }

  //NAVIGATION BACK TO VENDOR LISTING ON CLICK CANCEL BUTTON
  onCancelPress() {
    this.router.navigate(['master/vendor']);
  }

  patchVendorData(data: any) {
    if (data?.taxationType?.code === "RCM") {
      this.getTaxCodesRcmDropdownData();
    }else{
      this.getTaxCodesNonRcmDropdownData();
    }
    setTimeout(() => {
      this.onSelectTdsCode(data?.tdsCodes?.id)
      this.onChangeTaxationCode(data?.taxCodeId)
    },1000)

    this.onSelectTdsCode(data?.tdsCodes?.id);
    this.selectedTransactionTypes.clear();
    this.vendorForm.patchValue({
      vendorType: data?.vendorType,
      vendorCode: data?.vendorCode,
      vendorName: data?.vendorName,
      billingAddressLine1: data?.billingAddressLine1,
      billingAddressLine2: data?.billingAddressLine2,
      billingCity: data?.billingCity,
      billingState: data?.billingState,
      billingCountry: data?.billingCountry,
      billingPinCode: data?.billingPinCode,
      shippingAddressLine1: data?.shippingAddressLine1,
      shippingAddressLine2: data?.shippingAddressLine2,
      shippingCity: data?.shippingCity,
      shippingState: data?.shippingState,
      shippingCountry: data?.shippingCountry,
      shippingPinCode: data?.shippingPinCode,
      pan: data?.pan,
      gst: data?.gst,
      gstTreatment: data?.gstTreatment,
      msmeRegistered: data?.msmeRegistered,
      msmeType: data?.msmeType,
      msmeNo: data?.msmeNo,
      contactPersonName: data?.contactPersonName,
      designation: data?.designation,
      email1: data?.email1,
      email2: data?.email2,
      phoneMobileNo: data?.phoneMobileNo,
      currency: data?.currency,
      paymentTerms: data?.paymentTerms,
      bankName: data?.bankName,
      accountHolderName: data?.accountHolderName,
      accountNumber: data?.accountNumber,
      confirmAccountNumber: data?.confirmAccountNumber,
      ifscCode: data?.ifscCode,
      swiftCode: data?.swiftCode,
      bankAddressLine1: data?.bankAddressLine1,
      bankAddressLine2: data?.bankAddressLine2,
      branch: data?.branch,
      bankCity: data?.bankCity,
      bankState: data?.bankState,
      bankPinCode: data?.bankPinCode,
      status: data?.status
    });
    
    if (data?.vendorMappingModels) {
      this.transactionMappings = data.vendorMappingModels.map((mapping: any) => {
        this.selectedTransactionTypes.add(mapping.transactionType.code);
        return {
          transactionType: mapping.transactionType.code || {},
          paidByDetails: mapping.paidByDetails.code + ' (' + mapping.paidByDetails.value + ')' || {},
          iTransactionTypeId: mapping.transactionType.id || {},
          id: mapping.paidByDetails.id || {},
          status: mapping?.status,
          disabled: true,
          disabledTransaction: true,
          isShow: false,
        };
      });
    }
     
  }

  onOptionSelected(event: any) {
    this.vendorForm.patchValue({
      // taxCodeId: null
    })
    const selectedLookup = this.rcmNonRcmType.find(
      (lookup: any) => lookup.id === event
    );
    if (selectedLookup?.code === 'RCM') {
     this.getTaxCodesRcmDropdownData();
    } else {
      this.getTaxCodesNonRcmDropdownData();
    }
  }

  onChangeTaxationCode(event: any){
    const selectedTaxCode = this.taxCodes.find((item: any) => item.id == event)
      this.vendorForm.patchValue({
      // cgst: selectedTaxCode?.attribute5 || 0,
      // sgst: selectedTaxCode?.attribute6 || 0,
      // igst: selectedTaxCode?.attribute7 || 0,
    });
  }

  onSelectTdsCode(event: any){
    const selectedLookup = this.tdsCodes.find(
      (lookup: any) => lookup.id === event
    );

    this.vendorForm.patchValue({
      // tds: selectedLookup?.attribute5
    })
  }

  validateNo(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  phoneNumberLength(e: any) {
    const phoneControl = this.vendorForm.get('phone');
    if (phoneControl?.value) {
      // this.disableSubmit = phoneControl.value.length < 10 || phoneControl.value.length > 12 ? true : false;
    }
  }

  getAllPaidByDetails() {
    let data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'PaidByDetails';
    this.vendorService.getDropdownData(data, type).subscribe(
      (response: any) => {
        this.paidbyDetailsList = response.lookUps.filter(
          (item: any) => item.status === 'Active');
      },
      (error) => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      }
    );
  }

  getTransporterModeDropdownData() {
    const data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'TransporterMode';
    // this.transporterService.getDropdownData(data, type).subscribe((res: any) => {
    //   this.transporterMode = res.lookUps
    // })
  }
  getRCMNonRCMTypeDropdownData() {
    const data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'RCM_Non_RCM_Type';
    this.vendorService.getDropdownData(data, type).subscribe((res: any) => {
      this.rcmNonRcmType = res.lookUps.filter(
        (item: any) => item.status === 'Active');
    });
  }

  getTaxCodesRcmDropdownData() {
    const data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'TaxCodesRCM';
    this.vendorService.getDropdownData(data, type).subscribe((res: any) => {
      this.taxCodes = res.lookUps.filter(
        (item: any) => item.status === 'Active');
    });
  }

  getTaxCodesNonRcmDropdownData() {
    const data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'TaxCodesNonRCM';
    this.vendorService.getDropdownData(data, type).subscribe((res: any) => {
      this.taxCodes = res.lookUps.filter(
        (item: any) => item.status === 'Active');
    });
  }

  getTdsCodesDropdownData() {
    const data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'TdsCodes';
    this.vendorService.getDropdownData(data, type).subscribe((res: any) => {
      this.tdsCodes = res.lookUps.filter(
        (item: any) => item.status === 'Active');
    });
  }

  onAddTransactionRow() {
    let obj = {
      transactionType: undefined,
      paidByDetails: undefined,
      disabled: false,
      disabledTransaction: false,
      status: 'Active',
      isShow: true
    };
    this.transactionMappings.push(obj);
    
  }

  onTransactionTypeSelect(e: any, index: number) {
    const selectedTypeValue = e;
    if (selectedTypeValue) {
      this.transactionMappings[index].transactionType = selectedTypeValue;
      this.selectedTransactionTypes.add(selectedTypeValue);
    }
  }
  

  onTransactionTypeClear(index: number) {
    const clearedTypeValue = this.transactionMappings[index].transactionType;
    if (clearedTypeValue) {
      this.selectedTransactionTypes.delete(clearedTypeValue);
      this.transactionMappings[index].transactionType = undefined;
    }
  }

  getAvailableTransactionTypes(index: number): any[] {
    return this.transactionTypes.filter(type => !this.selectedTransactionTypes.has(type.code) || this.transactionMappings[index].transactionType === type.code);
  }
  
  
  onPaidByDetailsClear(ind: number) {
    this.transactionMappings[ind].paidByDetailsId = undefined;
  }

  onPaidByDetailsSelect(e: any, index: any) {
    this.transactionMappings[index].paidByDetails = e;
  }

  onDeleteTransaction(transaction: any, index: number) {
    // const deletedTransaction = {
    //   id: transaction.id,
    //   transactionTypeId: transaction.transactionTypeId,
    //   status: 'Inactive',
    // };
    //   if (deletedTransaction.id != 0 && deletedTransaction.transactionTypeId) {
    //     this.deletedTransactions.push(deletedTransaction);
    //   }
    //   this.selectedTransactionCodes = this.selectedTransactionCodes.filter(
    //     code => code !== transaction.code
    // );
    this.transactionMappings.splice(index, 1);
    // this.updateSelectedTransactionCodes();
  }

  getFreightCity() {
    let data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'FreightCity';
    this.lookupService.getLocationsLookup(data, type).subscribe((res: any) => {
      this.freightCity = res.lookUps.filter(
        (item: any) => item.status === 'Active');
    }, error => {

    });
  }

  onStatusChange(status: string, transaction: any) {
    transaction.disabled = status === 'Inactive';
  }
}
