import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorService } from '../../../../core/service/vendor.service';
import { VendorDataModel } from '../../../../core/model/masterModels.model';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../../../../core/service/country.service';

@Component({
  selector: 'app-add-edit-vendor',
  templateUrl: './add-edit-vendor.component.html',
  styleUrl: './add-edit-vendor.component.scss',
})
export class AddEditVendorComponent implements OnInit {
  queryData: any;
  vendorId: number = 0;
  vendorData: VendorDataModel = {};
  vendorsList: any = [];
  countryList: any = [];
  stateList: any = [];
  loadSpinner: boolean = true;
  disableSubmit: boolean = false;
  vendorType: string = '';
  showComplianceTab: boolean = true;
  statusTab: boolean = false;
  showExtraTab: boolean = false;
  selectedTransactionTypes: Set<string> = new Set();
  isShow: boolean = false;
  statusValue: string = '';
  isBillingCountryDisabled: boolean = false;
  IfscInput: boolean = true;
  showSwiftfield: boolean = true;

  requiredFieldsForDOM = [
    'vendorType',
    'vendorName',
    'billingAddressLine1',
    'billingCity',
    'billingState',
    'billingCountry',
    'billingPinCode',
    'shippingAddressLine1',
    'shippingCity',
    'shippingState',
    'shippingCountry',
    'shippingPinCode',
    'bankAddressLine1',
    'gstTreatment',
    'msmeRegistered',
    'currency',
    'bankName',
    'bankCountry',
    'accountHolderName',
    'accountNumber',
    'confirmAccountNumber',
    'ifscCode',
  ];

  requiredFieldsForVIM = [
    'vendorType',
    'vendorName',
    'billingAddressLine1',
    'billingCity',
    'billingCountry',
    'billingPinCode',
    'shippingAddressLine1',
    'shippingCity',
    'shippingCountry',
    'shippingPinCode',
    'currency',
    'bankName',
    'accountHolderName',
    'accountNumber',
    'confirmAccountNumber',
    'bankAddressLine1',
    'bankCity',
    'bankPinCode',
    'bankCountry',
  ];

  currentRequiredFields: string[] = [];

  vendorForm = new FormGroup({
    vendorType: new FormControl('', Validators.required),
    vendorCode: new FormControl(''),
    vendorName: new FormControl('', Validators.required),

    billingAddressLine1: new FormControl('', Validators.required),
    billingAddressLine2: new FormControl(''),
    billingCity: new FormControl('', Validators.required),
    billingState: new FormControl(''),
    billingCountry: new FormControl('', Validators.required),
    billingPinCode: new FormControl('', [
      Validators.required,
      // Validators.pattern(/^[0-9]{6}$/),
    ]),

    shippingAddressLine1: new FormControl('', Validators.required),
    shippingAddressLine2: new FormControl(''),
    shippingCity: new FormControl('', Validators.required),
    shippingState: new FormControl(''),
    shippingCountry: new FormControl('', Validators.required),
    shippingPinCode: new FormControl('', [
      Validators.required,
      // Validators.pattern(/^[0-9]{6}$/),
    ]),
    sameAsBilling: new FormControl(false),
    pan: new FormControl('', [
      Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/), // optional PAN format
    ]),
    gst: new FormControl(''),
    gstTreatment: new FormControl('', Validators.required),
    msmeRegistered: new FormControl<boolean | null>(null),
    msmeType: new FormControl(''),
    msmeNo: new FormControl(''),

    contactPersonName: new FormControl(''),
    designation: new FormControl(''),
    email1: new FormControl('', [Validators.email]),
    email2: new FormControl('', [Validators.email]),
    countryCode: new FormControl(''),
    phoneMobileNo: new FormControl('', [
      Validators.pattern('^[0-9]*$'), // allows only digits (0-9)
    ]),
    currency: new FormControl('', Validators.required),
    paymentTerms: new FormControl(''),

    bankName: new FormControl('', Validators.required),
    accountHolderName: new FormControl('', Validators.required),
    accountNumber: new FormControl('', [Validators.required]),
    confirmAccountNumber: new FormControl('', [Validators.required]),

    ifscCode: new FormControl('', [
      Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/),
    ]),
    swiftCode: new FormControl(''),

    bankAddressLine1: new FormControl(''),
    bankAddressLine2: new FormControl(''),
    branch: new FormControl(''),
    bankCity: new FormControl(''),
    bankState: new FormControl(''),
    bankPinCode: new FormControl(''),

    iban: new FormControl(''),
    sortCode: new FormControl(''),
    routingNo: new FormControl(''),
    bankCountry: new FormControl(''),
    fCTCCharges: new FormControl(''),
    complDocyear: new FormControl(''),

    status: new FormControl(''),
  });

  constructor(
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    private vendorService: VendorService,
    private toastr: ToastrService,
    private countryService: CountryService
  ) {}

  ngOnInit(): void {
    this.loadSpinner = true;
    this.queryData = this._Activatedroute.snapshot.paramMap.get('vendorId');
    this.vendorId =
      Number(this._Activatedroute.snapshot.paramMap.get('vendorId')) || 0;

    this.getVendorData(this.queryData); // fetch the full vendor data
    this.AllcountryList();
    this.AllstateList();

    this.vendorForm.get('accountNumber')?.valueChanges.subscribe(() => {
      this.checkAccountMatch();
    });

    this.vendorForm.get('confirmAccountNumber')?.valueChanges.subscribe(() => {
      this.checkAccountMatch();
    });

    //check that account no matches with confirm account number

    if (this.vendorId == 0) {
      this.statusTab = false;
    }
    if (this.vendorId > 0) {
      this.statusTab = true;
    }
  }

  //get all the country list
  AllcountryList() {
    var data = {};
    this.countryService.getCountryData(data).subscribe(
      (response: any) => {
        this.countryList = response.countrys;
        console.log(this.countryList);
        this.loadSpinner = false;
      },
      (error) => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  AllstateList() {
    var data = {
      CountryName: '',
    };
    this.countryService.getStateData(data).subscribe(
      (response: any) => {
        this.stateList = response.states;
        console.log(this.stateList);
        this.loadSpinner = false;
      },
      (error) => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  onMsmeRegisterChange() {
    const value = this.vendorForm.get('msmeRegistered')?.value;

    if (value) {
      this.vendorForm.get('msmeType')?.setValidators([Validators.required]);
      this.vendorForm.get('msmeNo')?.setValidators([Validators.required]);

      if (!this.requiredFieldsForDOM.includes('msmeType')) {
        this.requiredFieldsForDOM.push('msmeType');
      }
      if (!this.requiredFieldsForDOM.includes('msmeNo')) {
        this.requiredFieldsForDOM.push('msmeNo');
      }

      this.currentRequiredFields = [...this.requiredFieldsForDOM];
    } else {
      this.vendorForm.get('msmeType')?.clearValidators();
      this.vendorForm.get('msmeNo')?.clearValidators();

      this.requiredFieldsForDOM = this.requiredFieldsForDOM.filter(
        (f) => f !== 'msmeNo'
      );

      this.requiredFieldsForDOM = this.requiredFieldsForDOM.filter(
        (f) => f !== 'msmeType'
      );

      this.currentRequiredFields = [...this.requiredFieldsForDOM];
    }

    this.vendorForm.get('msmeType')?.updateValueAndValidity();
    this.vendorForm.get('msmeNo')?.updateValueAndValidity();
  }

  onGSTTreatmentChange(event: any): void {
    const selectedGSTTreatment = event.target.value;

    const gstControl = this.vendorForm.get('gst');
    const gstPattern = Validators.pattern(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    );

    if (
      selectedGSTTreatment === 'Unregistered' ||
      selectedGSTTreatment === 'Consumer'
    ) {
      // GST is optional, only pattern applies
      gstControl?.setValidators([gstPattern]);

      this.requiredFieldsForDOM = this.requiredFieldsForDOM.filter(
        (f) => f !== 'gst'
      );
    } else {
      // GST is required and must match the pattern
      gstControl?.setValidators([Validators.required, gstPattern]);

      if (!this.requiredFieldsForDOM.includes('gst')) {
        this.requiredFieldsForDOM.push('gst');
      }
    }

    this.currentRequiredFields = [...this.requiredFieldsForDOM];
    gstControl?.updateValueAndValidity();
  }

  checkAccountMatch(): void {
    const accountNumber = this.vendorForm.get('accountNumber')?.value;
    const confirmAccountNumber = this.vendorForm.get(
      'confirmAccountNumber'
    )?.value;

    if (
      accountNumber &&
      confirmAccountNumber &&
      accountNumber !== confirmAccountNumber
    ) {
      this.vendorForm
        .get('confirmAccountNumber')
        ?.setErrors({ mismatch: true });
    } else {
      // Preserve other errors like 'required' or 'pattern'
      const confirmCtrl = this.vendorForm.get('confirmAccountNumber');
      if (confirmCtrl?.hasError('required') || confirmCtrl?.hasError('pattern'))
        return;

      confirmCtrl?.setErrors(null);
    }
  }
  onVendorTypeChange(event: any) {
    const selectedType = event.target.value;
    this.vendorType = selectedType;

    if (this.vendorType === 'EIPVIMP') {
      this.currentRequiredFields = this.requiredFieldsForVIM;
      this.showComplianceTab = false;
      this.IfscInput = false;
      this.showExtraTab = true;
      this.vendorForm
        .get('billingPinCode')
        ?.setValidators([Validators.required]);
      this.vendorForm.get('billingPinCode')?.updateValueAndValidity();

      this.vendorForm
        .get('shippingPinCode')
        ?.setValidators([Validators.required]);
      this.vendorForm.get('shippingPinCode')?.updateValueAndValidity();

      this.vendorForm.get('bankPinCode')?.setValidators([Validators.required]);
      this.vendorForm.get('bankPinCode')?.updateValueAndValidity();

      this.vendorForm
        .get('bankAddressLine1')
        ?.setValidators([Validators.required]);
      this.vendorForm.get('bankAddressLine1')?.updateValueAndValidity();

      this.vendorForm.get('bankCity')?.setValidators([Validators.required]);
      this.vendorForm.get('bankCity')?.updateValueAndValidity();

      this.vendorForm.get('bankPinCode')?.setValidators([Validators.required]);
      this.vendorForm.get('bankPinCode')?.updateValueAndValidity();

      this.vendorForm.get('bankCountry')?.setValidators([Validators.required]);
      this.vendorForm.get('bankCountry')?.updateValueAndValidity();

      this.vendorForm.get('billingState')?.clearValidators();
      this.vendorForm.get('billingState')?.updateValueAndValidity();

      this.vendorForm.get('shippingState')?.clearValidators();
      this.vendorForm.get('shippingState')?.updateValueAndValidity();

      this.vendorForm.get('msmeType')?.clearValidators();
      this.vendorForm.get('msmeType')?.updateValueAndValidity();

      this.vendorForm.get('msmeRegistered')?.setValue(false);
      this.vendorForm.get('msmeRegistered')?.clearValidators();
      this.vendorForm.get('msmeRegistered')?.updateValueAndValidity();

      this.vendorForm.get('msmeNo')?.clearValidators();
      this.vendorForm.get('msmeNo')?.updateValueAndValidity();

      this.vendorForm.get('phoneMobileNo')?.clearValidators();
      this.vendorForm
        .get('phoneMobileNo')
        ?.setValidators([Validators.pattern('^[0-9]*$')]);
      this.vendorForm.get('phoneMobileNo')?.updateValueAndValidity();

      this.vendorForm.get('ifscCode')?.clearValidators();
      this.vendorForm.get('ifscCode')?.updateValueAndValidity();

      this.vendorForm.get('gstTreatment')?.clearValidators();
      this.vendorForm.get('gstTreatment')?.updateValueAndValidity();

      this.vendorForm
        .get('accountNumber')
        ?.setValidators([Validators.required]);
      this.vendorForm.get('accountNumber')?.updateValueAndValidity();

      this.vendorForm
        .get('confirmAccountNumber')
        ?.setValidators([Validators.required]);
      this.vendorForm.get('confirmAccountNumber')?.updateValueAndValidity();
    } else {
      this.currentRequiredFields = this.requiredFieldsForDOM;
      this.showComplianceTab = true;
      this.showExtraTab = false;
      this.IfscInput = true;
      this.onMsmeRegisterChange();

      this.vendorForm
        .get('msmeRegistered')
        ?.setValidators([Validators.required]);
      this.vendorForm.get('msmeRegistered')?.updateValueAndValidity();

      this.vendorForm
        .get('phoneMobileNo')
        ?.setValidators([Validators.pattern(/^[0-9]{10}$/)]);
      this.vendorForm.get('phoneMobileNo')?.updateValueAndValidity();

      this.vendorForm
        .get('ifscCode')
        ?.setValidators([
          Validators.required,
          Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/),
        ]);
      this.vendorForm.get('ifscCode')?.updateValueAndValidity();

      this.vendorForm
        .get('billingPinCode')
        ?.setValidators([
          Validators.required,
          Validators.pattern(/^[0-9]{6}$/),
        ]);
      this.vendorForm.get('billingPinCode')?.updateValueAndValidity();

      this.vendorForm
        .get('shippingPinCode')
        ?.setValidators([
          Validators.required,
          Validators.pattern(/^[0-9]{6}$/),
        ]);
      this.vendorForm.get('shippingPinCode')?.updateValueAndValidity();

      this.vendorForm
        .get('bankPinCode')
        ?.setValidators([Validators.pattern(/^[0-9]{6}$/)]);
      this.vendorForm.get('bankPinCode')?.updateValueAndValidity();

      this.vendorForm
        .get('pan')
        ?.setValidators([Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]);
      this.vendorForm.get('pan')?.updateValueAndValidity();

      this.vendorForm
        .get('accountNumber')
        ?.setValidators([
          Validators.required,
          Validators.pattern(/^\d{9,18}$/),
        ]);
      this.vendorForm.get('accountNumber')?.updateValueAndValidity();

      this.vendorForm
        .get('confirmAccountNumber')
        ?.setValidators([
          Validators.required,
          Validators.pattern(/^\d{9,18}$/),
        ]);
      this.vendorForm.get('confirmAccountNumber')?.updateValueAndValidity();
    }

    if (selectedType === 'EIPVDOM') {
      this.vendorForm.patchValue({ billingCountry: 'India' });
      this.vendorForm.patchValue({ shippingCountry: 'India' });
      this.vendorForm.patchValue({ bankCountry: 'India' });
      this.vendorForm.patchValue({ currency: 'Indian Rupee' });
      this.vendorForm.patchValue({ countryCode: '+91' });
      this.vendorForm.get('billingCountry')?.disable();
      this.vendorForm.get('shippingCountry')?.disable();
      this.vendorForm.get('bankCountry')?.disable();
      this.vendorForm.get('currency')?.disable();
      this.vendorForm.get('countryCode')?.disable();
    } else {
      this.vendorForm.get('billingCountry')?.enable();
      this.vendorForm.get('shippingCountry')?.enable();
      this.vendorForm.get('bankCountry')?.enable();
      this.vendorForm.get('currency')?.enable();
      this.vendorForm.get('countryCode')?.enable();
    }
  }

  onSelectbillingCountry(e: any) {
    this.vendorForm.get('billingCountry')?.setValue(e?.target?.innerText);
  }
  onSelectshippingCountry(e: any) {
    this.vendorForm.get('shippingCountry')?.setValue(e?.target?.innerText);
  }
  onSelectCurrency(e: any) {
    this.vendorForm.get('currency')?.setValue(e?.target?.innerText);
  }
  //TO GET THE VENDOR DATA
  getVendorData(vendorId: string) {
    this.vendorService.getVendorData(vendorId).subscribe(
      (response: any) => {
        this.vendorData = response;
        this.patchVendorData(response);
        if (response.shippingAddressLine1 == response.billingAddressLine1) {
          this.copyBillingToShipping(true);
        }
        const selectedType = this.vendorForm.get('vendorType')?.value;
        if (selectedType) {
          this.onVendorTypeChange({ target: { value: selectedType } });
          this.vendorForm.get('vendorType')?.disable();
        }
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
      actionBy: '',
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
      countryCode: this.vendorForm.get('countryCode')?.value,
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
      iban: this.vendorForm.get('iban')?.value,
      sortCode: this.vendorForm.get('sortCode')?.value,
      routingNo: this.vendorForm.get('routingNo')?.value,
      bankCountry: this.vendorForm.get('bankCountry')?.value,
      fCTCCharges: this.vendorForm.get('fCTCCharges')?.value,
      complDocyear: this.vendorForm.get('complDocyear')?.value,
      status: this.vendorForm.get('status')?.value,
    };

    if (this.vendorId == 0) {
      this.loadSpinner = true;
      this.vendorService.createVendor(data).subscribe(
        (response: any) => {
          this.vendorData = response;
          this.loadSpinner = false;
          this.toastr.success('Vendor Created Successfully');
          this.router.navigate(['/master/vendor']);
        },
        () => {
          //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
          this.loadSpinner = false;
        }
      );
    } else {
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

  //NAVIGATION BACK TO VENDOR LISTING ON CLICK CANCEL BUTTON
  onCancelPress() {
    this.router.navigate(['master/vendor']);
  }

  patchVendorData(data: any) {
    setTimeout(() => {}, 1000);
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
      countryCode: data?.countryCode,
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
      iban: data?.iban,
      sortCode: data?.sortCode,
      routingNo: data?.routingNo,
      bankCountry: data?.bankCountry,
      fCTCCharges: data?.fCTCCharges,
      complDocyear: data?.complDocyear,
      status: data?.status,
    });
    this.checkAccountMatch();
  }

  onOptionSelected(event: any) {
    this.vendorForm.patchValue({});
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
  }

  onStatusChange(status: string, transaction: any) {
    transaction.disabled = status === 'Inactive';
  }

  copyBillingToShipping(event: any) {
    let isChecked: boolean;

    if (typeof event === 'boolean') {
      isChecked = event; // coming from code
      this.vendorForm.get('sameAsBilling')?.setValue(true);
    } else {
      isChecked = event.target.checked; // coming from checkbox event
    }
    

    if (isChecked) {
      this.vendorForm.patchValue({
        shippingAddressLine1: this.vendorForm.get('billingAddressLine1')?.value,
        shippingAddressLine2: this.vendorForm.get('billingAddressLine2')?.value,
        shippingCountry: this.vendorForm.get('billingCountry')?.value,
        shippingCity: this.vendorForm.get('billingCity')?.value,
        shippingState: this.vendorForm.get('billingState')?.value,
        shippingPinCode: this.vendorForm.get('billingPinCode')?.value,
      });

      this.vendorForm.get('shippingAddressLine1')?.disable();
      this.vendorForm.get('shippingAddressLine2')?.disable();
      this.vendorForm.get('shippingCountry')?.disable();
      this.vendorForm.get('shippingCity')?.disable();
      this.vendorForm.get('shippingState')?.disable();
      this.vendorForm.get('shippingPinCode')?.disable();
    } else {
      this.vendorForm.get('shippingAddressLine1')?.enable();
      this.vendorForm.get('shippingAddressLine2')?.enable();
      this.vendorForm.get('shippingCountry')?.enable();
      this.vendorForm.get('shippingCity')?.enable();
      this.vendorForm.get('shippingState')?.enable();
      this.vendorForm.get('shippingPinCode')?.enable();

      this.vendorForm.patchValue({
        shippingAddressLine1: '',
        shippingAddressLine2: '',
        shippingCity: '',
        shippingState: '',
        shippingPinCode: '',
        shippingCountry: '',
      });
    }
  }
}
