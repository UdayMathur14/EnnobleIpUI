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

@Component({
  selector: 'app-add-edit-vendor',
  templateUrl: './add-edit-vendor.component.html',
  styleUrl: './add-edit-vendor.component.scss',
})
export class AddEditVendorComponent implements OnInit {
  queryData: any;
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
  vendorForm = new FormGroup({
    vendorCode: new FormControl(''),
    vendorName: new FormControl(''),
    vendorAddress1: new FormControl(''),
    vendorAddress2: new FormControl(''),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{10}$'),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/),
    ]),
    city: new FormControl(''),
    state: new FormControl(''),
    country: new FormControl(''),
    postalCode: new FormControl(''),
    pan: new FormControl(''),
    gstin: new FormControl(''),
    // paymentTermCode: new FormControl(''),
    // paymentStatus: new FormControl(''),
    // paidByDetail: new FormControl('', [Validators.required]),
    taxationTypeId: new FormControl('', [Validators.required]),
    taxCodeId: new FormControl('', [Validators.required]),
    // tdsCodeId: new FormControl('', [Validators.required]),
    cgst: new FormControl(''),
    sgst: new FormControl(''),
    igst: new FormControl(''),
    tds: new FormControl(''),
    // rcmNonRcm: new FormControl(''),
    status: new FormControl('', [Validators.required]),
  });

  constructor(
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    private vendorService: VendorService,
    private pointChargeService: PointChargeService,
    private toastr: ToastrService,
    private transactionTypeService: TransactionTypesService
  ) {}

  ngOnInit(): void {
    this.loadSpinner = true;
    this.queryData = this._Activatedroute.snapshot.paramMap.get('vendorId');
    this.getVendorData(this.queryData);
    this.getAllPointChargesList();
    this.getTaxationCodeDropdownData();
    this.getPaidByDetailsDropdownData();
    this.getTransactionTypes();
    this.getRCMNonRCMTypeDropdownData();
    this.getTdsCodesDropdownData();

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
      actionBy: localStorage.getItem('userId'),
      contactNumber: this.vendorForm.get('phone')?.value,
      email: this.vendorForm.get('email')?.value,
      taxationTypeId: this.vendorForm.get('taxationTypeId')?.value || 0,
      taxCodeId: this.vendorForm.get('taxCodeId')?.value || 0,
      // tdsCodeId: this.vendorForm.get('tdsCodeId')?.value || 0,
      status: this.vendorForm.get('status')?.value,
      vendorMappingUpdateModels: this.transactionMappings.map((mapping: any) => { 
        const iTransactionTypeId = this.transactionTypes.find((item: any)=> item.code == mapping.transactionType)
        
        return {                                                                          
          transactionTypeId: iTransactionTypeId?.iTransactionTypeId || mapping?.iTransactionTypeId,                        
          paidByDetailsId: mapping?.paidByDetails?.id || mapping?.id,
          status: mapping.status
        }
      })
    };
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
        this.transactionTypes = res?.transactionTypes;
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
      this.taxationCode = res.lookUps;
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
      this.paidByDetails = res.lookUps;
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
      vendorCode: data?.vendorCode,
      vendorName: data.vendorName,
      vendorAddress1: data.vendorAddress1,
      vendorAddress2: data.vendorAddress2,
      phone: data.contactNumber,
      email: data.email,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: data.postalCode,
      pan: data.panNo,
      gstin: data.gstInNo,
      taxationTypeId: data?.taxationTypeId,
      taxCodeId: data?.taxCodeId,
      // tdsCodeId: data?.tdsCodeId,
      // paymentTermCode: data.payTermCode,
      // paymentStatus: data.payTermStatus,
      // paidByDetail: data.paidByDetail?.value,
      // taxationCode: data.taxationType?.id,
      cgst: data?.attribute5,
      sgst: data?.attribute6,
      igst: data?.attribute7,
      status: data?.status,
      // rcmNonRcm: data.taxationType?.attribute8 === 1 ? 'RCM' : 'Non RCM' || '',
    });

    if (data?.vendorMappingModels) {
      this.transactionMappings = data.vendorMappingModels.map((mapping: any) => {
        this.selectedTransactionTypes.add(mapping.transactionType.code);
        return {
          transactionType: mapping.transactionType.code || {},
          paidByDetails: mapping.paidByDetails.code || {},
          iTransactionTypeId: mapping.transactionType.iTransactionTypeId || {},
          id: mapping.paidByDetails.id || {},
          status: 'Active',
          disabled: true
        };
      });
    }
     
  }

  onOptionSelected(event: any) {
    this.vendorForm.patchValue({
      taxCodeId: null
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
      cgst: selectedTaxCode?.attribute5 || 0,
      sgst: selectedTaxCode?.attribute6 || 0,
      igst: selectedTaxCode?.attribute7 || 0,
    });
  }

  onSelectTdsCode(event: any){
    const selectedLookup = this.tdsCodes.find(
      (lookup: any) => lookup.id === event
    );

    this.vendorForm.patchValue({
      tds: selectedLookup?.attribute5
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
      this.disableSubmit = phoneControl.value.length < 10 ? true : false;
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
        this.paidbyDetailsList = response.lookUps;
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
      this.rcmNonRcmType = res.lookUps;
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
      this.taxCodes = res.lookUps;
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
      this.taxCodes = res.lookUps;
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
      this.tdsCodes = res.lookUps;
    });
  }

  onAddTransactionRow() {
    let obj = {
      transactionType: undefined,
      paidByDetails: undefined,
      disabled: false,
      status: 'Active'
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
}
