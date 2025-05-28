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
  msmeTypeSelected = false;
  isMsmeTypeHidden = false;
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
    'gstTreatment',
    'msmeRegistered',
    'currency',
    'bankName',
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

    pan: new FormControl('', [
      Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/), // optional PAN format
    ]),
    gst: new FormControl('', [
      Validators.pattern(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
      ),
    ]),
    gstTreatment: new FormControl(''),
    msmeRegistered: new FormControl(true),
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
    accountNumber: new FormControl('', [
      Validators.required,
      // Validators.pattern(/^\d{9,18}$/), // Validates a 9 to 18 digit account number
    ]),
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

    //hide the type when selected no
    this.vendorForm.get('msmeRegistered')?.valueChanges.subscribe((value) => {
      this.isMsmeTypeHidden = !value; // hide if value is false (No)
      if (!value) {
        this.vendorForm.get('msmeType')?.reset();
      }
      if (value === true) {
        this.vendorForm.get('msmeType')?.setValidators([Validators.required]);

        // ✅ Add to requiredFieldsForDOM
        if (!this.requiredFieldsForDOM.includes('msmeType')) {
          this.requiredFieldsForDOM.push('msmeType');
        }
      } else {
        this.vendorForm.get('msmeType')?.clearValidators();
        this.vendorForm.get('msmeType')?.reset();

        // ❌ Remove from requiredFieldsForDOM
        this.requiredFieldsForDOM = this.requiredFieldsForDOM.filter(
          (f) => f !== 'msmeType'
        );
      }

      this.vendorForm.get('msmeType')?.updateValueAndValidity();
    });

    //if true then set the validators else remove it
    this.vendorForm.get('msmeRegistered')?.valueChanges.subscribe((value) => {
      if (value === true) {
        this.vendorForm.get('msmeType')?.setValidators([Validators.required]);
      } else {
        this.vendorForm.get('msmeType')?.clearValidators();
        this.vendorForm.get('msmeType')?.reset();
      }
      this.vendorForm.get('msmeType')?.updateValueAndValidity();
    });

    //check that account no matches with confirm account number
    this.vendorForm.get('confirmAccountNumber')?.valueChanges.subscribe(() => {
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
        this.vendorForm.get('confirmAccountNumber')?.setErrors(null);
      }
    });

     if (this.vendorId > 0) {
      const fakeEvent = { target: { value: this.vendorData } };
      this.onVendorTypeChange(fakeEvent);
      this.vendorForm.get('vendorType')?.disable();
    }
    // if (this.vendorId > 0) {
    //   const vendorType = this.vendorForm.get('vendorType');
    //   this.statusTab = true;
    //   this.vendorForm.get('vendorType')?.disable();

    //   if (vendorType === 'EIPVDOM') {
    //     this.isBillingCountryDisabled = true;
    //     this.showSwiftfield = false;
    //     this.showExtraTab = false;
    //     this.showComplianceTab = true;
    //   } else {
    //     this.showComplianceTab = false;
    //     this.showSwiftfield = true;
    //     this.IfscInput = false;
    //     this.showExtraTab = true;
    //     this.vendorForm
    //       .get('billingPinCode')
    //       ?.setValidators(Validators.required);
    //     this.vendorForm.get('billingPinCode')?.updateValueAndValidity();
    //     this.vendorForm
    //       .get('shippingPinCode')
    //       ?.setValidators(Validators.required);
    //     this.vendorForm.get('shippingPinCode')?.updateValueAndValidity();
    //     this.vendorForm.get('bankPinCode')?.setValidators(Validators.required);
    //     this.vendorForm.get('bankPinCode')?.updateValueAndValidity();
    //     this.vendorForm.get('pan')?.clearValidators();
    //     this.vendorForm.get('pan')?.updateValueAndValidity();
    //     this.vendorForm.get('msmeRegistered')?.clearValidators();
    //     this.vendorForm.get('msmeRegistered')?.updateValueAndValidity();
    //     this.vendorForm.get('phoneMobileNo')?.clearValidators();
    //     this.vendorForm.get('phoneMobileNo')?.updateValueAndValidity();
    //     this.vendorForm.get('ifscCode')?.clearValidators();
    //     this.vendorForm.get('ifscCode')?.updateValueAndValidity();
    //     this.vendorForm.get('accountNumber')?.clearValidators();
    //     this.vendorForm
    //       .get('accountNumber')
    //       ?.setValidators(Validators.required);
    //   }
    // }
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

  onMsmeTypeChange(event: any) {
    const selectedType = event.target.value;

    // If MSME Type is selected, make MSME No required
    if (
      selectedType === 'MICRO' ||
      selectedType === 'SMALL' ||
      selectedType === 'MEDIUM'
    ) {
      this.msmeTypeSelected = true;
      this.vendorForm.get('msmeNo')?.setValidators([Validators.required]);
      if (!this.requiredFieldsForDOM.includes('msmeNo')) {
        this.requiredFieldsForDOM.push('msmeNo');
      }
    } else {
      this.msmeTypeSelected = false;
      this.vendorForm.get('msmeNo')?.clearValidators(); // If MSME Type is cleared, MSME No is not required
      this.requiredFieldsForDOM = this.requiredFieldsForDOM.filter(
        (f) => f !== 'msmeNo'
      );
    }

    this.vendorForm.get('msmeNo')?.updateValueAndValidity();
  }

  onGSTTreatmentChange(event: any): void {
    const selectedGSTTreatment = event.target.value;

    const gstPattern = Validators.pattern(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    );

    // Update the GST field validation based on selected value
    if (selectedGSTTreatment === 'Unregistered') {
      // Make GST optional if Unregistered
      this.vendorForm.get('gst')?.clearValidators();
       this.vendorForm
        .get('gst')
        ?.setValidators( gstPattern);

      this.requiredFieldsForDOM = this.requiredFieldsForDOM.filter(
        (f) => f !== 'gst'
      );
      this.currentRequiredFields = [...this.requiredFieldsForDOM];
    } else {
      if (!this.requiredFieldsForDOM.includes('gst')) {
        this.requiredFieldsForDOM.push('gst');
      }
      // Make GST required for other cases
      this.vendorForm
        .get('gst')
        ?.setValidators([Validators.required, gstPattern]);
      if (this.vendorType === 'EIPVDOM') {
        this.currentRequiredFields = [...this.requiredFieldsForDOM];
      }
    }

    // Revalidate the GST field
    this.vendorForm.get('gst')?.updateValueAndValidity();
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

      // this.vendorForm.get('msmeRegistered')?.clearValidators();
      // this.vendorForm.get('msmeRegistered')?.updateValueAndValidity();

      this.vendorForm.get('phoneMobileNo')?.clearValidators();
      this.vendorForm
        .get('phoneMobileNo')
        ?.setValidators([Validators.pattern('^[0-9]*$')]);
      this.vendorForm.get('phoneMobileNo')?.updateValueAndValidity();

      this.vendorForm.get('ifscCode')?.clearValidators();
      this.vendorForm.get('ifscCode')?.updateValueAndValidity();

      this.vendorForm
        .get('accountNumber')
        ?.setValidators([Validators.required]);
      this.vendorForm.get('accountNumber')?.updateValueAndValidity();
    } else {
      this.currentRequiredFields = this.requiredFieldsForDOM;
      this.showComplianceTab = true;
      this.showExtraTab = false;
      this.IfscInput = true;

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
    }

    if (selectedType === 'EIPVDOM' && this.vendorId === 0) {
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
    if (data?.taxationType?.code === 'RCM') {
    } else {
    }
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
      iban: data?.bankPinCode,
      sortCode: data?.sortCode,
      routingNo: data?.routingNo,
      bankCountry: data?.bankCountry,
      fCTCCharges: data?.fCTCCharges,
      complDocyear: data?.complDocyear,
      status: data?.status,
    });
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
    const isChecked = event.target.checked;

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
