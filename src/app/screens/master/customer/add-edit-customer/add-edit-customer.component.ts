import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../../../core/service/customer.service';
import { CustomerDataModel } from '../../../../core/model/masterModels.model';
import { ToastrService } from 'ngx-toastr';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CountryService } from '../../../../core/service/country.service';

@Component({
  selector: 'app-add-edit-customer',
  templateUrl: './add-edit-customer.component.html',
  styleUrl: './add-edit-customer.component.scss',
})
export class AddEditCustomerComponent implements OnInit {
  queryData: any;
  customerId: number = 0;
  customerData: CustomerDataModel = {
    id: 0,
    customerType: '',
    customerCode: '',
    customerName: '',
    createdBy: '',
    createdOn: '',
    modifiedBy: '',
    modifiedOn: '',
    messageStatus: null,
  };
  customersList: any = [];
  countryList: any = [];
  stateList: any = [];
  loadSpinner: boolean = true;
  disableSubmit: boolean = false;
  customerType: string = '';
  showComplianceTab: boolean = true;
  statusTab: boolean = false;
  showExtraTab: boolean = false;
  selectedTransactionTypes: Set<string> = new Set();
  isShow: boolean = false;
  statusValue: string = '';
  isBillingCountryDisabled: boolean = false;

  requiredFieldsForDOM = [
    'customerType',
    'customerName',
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
  ];

  requiredFieldsForVIM = [
    'customerType',
    'customerName',
    'billingAddressLine1',
    'billingCity',
    'billingCountry',
    'billingPinCode',
    'shippingAddressLine1',
    'shippingCity',
    'shippingCountry',
    'shippingPinCode',
    'currency',
  ];

  currentRequiredFields: string[] = [];

  customerForm = new FormGroup({
    customerType: new FormControl('', Validators.required),
    customerName: new FormControl('', Validators.required),

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

    status: new FormControl(''),
  });

  constructor(
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private countryService: CountryService
  ) {}

  ngOnInit(): void {
    this.loadSpinner = true;
    this.queryData = this._Activatedroute.snapshot.paramMap.get('customerId');
    this.customerId =
      Number(this._Activatedroute.snapshot.paramMap.get('customerId')) || 0;

    this.getCustomerData(this.queryData); // fetch the full customer data
    this.AllcountryList();
    this.AllstateList();

    //check that account no matches with confirm account number

    if (this.customerId == 0) {
      this.statusTab = false;
    }
    if (this.customerId > 0) {
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
    const value = this.customerForm.get('msmeRegistered')?.value;

    if (value) {
      this.customerForm.get('msmeType')?.setValidators([Validators.required]);
      this.customerForm.get('msmeNo')?.setValidators([Validators.required]);

      if (!this.requiredFieldsForDOM.includes('msmeType')) {
        this.requiredFieldsForDOM.push('msmeType');
      }
      if (!this.requiredFieldsForDOM.includes('msmeNo')) {
        this.requiredFieldsForDOM.push('msmeNo');
      }

      this.currentRequiredFields = [...this.requiredFieldsForDOM];
    } else {
      this.customerForm.get('msmeType')?.clearValidators();
      this.customerForm.get('msmeNo')?.clearValidators();

      this.requiredFieldsForDOM = this.requiredFieldsForDOM.filter(
        (f) => f !== 'msmeNo'
      );

      this.requiredFieldsForDOM = this.requiredFieldsForDOM.filter(
        (f) => f !== 'msmeType'
      );

      this.currentRequiredFields = [...this.requiredFieldsForDOM];
    }

    this.customerForm.get('msmeType')?.updateValueAndValidity();
    this.customerForm.get('msmeNo')?.updateValueAndValidity();
  }

  onGSTTreatmentChange(event: any): void {
    const selectedGSTTreatment = event.target.value;

    const gstControl = this.customerForm.get('gst');
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

  onCustomerTypeChange(event: any) {
    const selectedType = event.target.value;
    this.customerType = selectedType;

    if (this.customerType === 'EIPCEXP') {
      this.currentRequiredFields = this.requiredFieldsForVIM;
      this.showComplianceTab = false;
      // this.showExtraTab = true;
      this.customerForm
        .get('billingPinCode')
        ?.setValidators([Validators.required]);
      this.customerForm.get('billingPinCode')?.updateValueAndValidity();

      this.customerForm
        .get('shippingPinCode')
        ?.setValidators([Validators.required]);
      this.customerForm.get('shippingPinCode')?.updateValueAndValidity();

      this.customerForm.get('shippingState')?.clearValidators();
      this.customerForm.get('shippingState')?.updateValueAndValidity();

      this.customerForm.get('msmeType')?.clearValidators();
      this.customerForm.get('msmeType')?.updateValueAndValidity();

      this.customerForm.get('msmeRegistered')?.setValue(false);
      this.customerForm.get('msmeRegistered')?.clearValidators();
      this.customerForm.get('msmeRegistered')?.updateValueAndValidity();

      this.customerForm.get('msmeNo')?.clearValidators();
      this.customerForm.get('msmeNo')?.updateValueAndValidity();

      this.customerForm.get('phoneMobileNo')?.clearValidators();
      this.customerForm
        .get('phoneMobileNo')
        ?.setValidators([Validators.pattern('^[0-9]*$')]);
      this.customerForm.get('phoneMobileNo')?.updateValueAndValidity();

      this.customerForm.get('ifscCode')?.clearValidators();
      this.customerForm.get('ifscCode')?.updateValueAndValidity();

      this.customerForm.get('gstTreatment')?.clearValidators();
      this.customerForm.get('gstTreatment')?.updateValueAndValidity();

      this.customerForm
        .get('accountNumber')
        ?.setValidators([Validators.required]);
      this.customerForm.get('accountNumber')?.updateValueAndValidity();

      this.customerForm
        .get('confirmAccountNumber')
        ?.setValidators([Validators.required]);
      this.customerForm.get('confirmAccountNumber')?.updateValueAndValidity();
    } else {
      this.currentRequiredFields = this.requiredFieldsForDOM;
      this.showComplianceTab = true;
      this.showExtraTab = false;
      this.onMsmeRegisterChange();

      this.customerForm
        .get('msmeRegistered')
        ?.setValidators([Validators.required]);
      this.customerForm.get('msmeRegistered')?.updateValueAndValidity();

      this.customerForm
        .get('phoneMobileNo')
        ?.setValidators([Validators.pattern(/^[0-9]{10}$/)]);
      this.customerForm.get('phoneMobileNo')?.updateValueAndValidity();

      this.customerForm
        .get('ifscCode')
        ?.setValidators([
          Validators.required,
          Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/),
        ]);
      this.customerForm.get('ifscCode')?.updateValueAndValidity();

      this.customerForm
        .get('billingPinCode')
        ?.setValidators([
          Validators.required,
          Validators.pattern(/^[0-9]{6}$/),
        ]);
      this.customerForm.get('billingPinCode')?.updateValueAndValidity();

      this.customerForm
        .get('shippingPinCode')
        ?.setValidators([
          Validators.required,
          Validators.pattern(/^[0-9]{6}$/),
        ]);
      this.customerForm.get('shippingPinCode')?.updateValueAndValidity();

      this.customerForm
        .get('pan')
        ?.setValidators([Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]);
      this.customerForm.get('pan')?.updateValueAndValidity();

      this.customerForm
        .get('accountNumber')
        ?.setValidators([
          Validators.required,
          Validators.pattern(/^\d{9,18}$/),
        ]);
      this.customerForm.get('accountNumber')?.updateValueAndValidity();

      this.customerForm
        .get('confirmAccountNumber')
        ?.setValidators([
          Validators.required,
          Validators.pattern(/^\d{9,18}$/),
        ]);
      this.customerForm.get('confirmAccountNumber')?.updateValueAndValidity();
    }

    if (selectedType === 'EIPCDOM') {
      this.customerForm.patchValue({ billingCountry: 'India' });
      this.customerForm.patchValue({ shippingCountry: 'India' });
      this.customerForm.patchValue({ currency: 'Indian Rupee' });
      this.customerForm.patchValue({ countryCode: '+91' });
      this.customerForm.get('billingCountry')?.disable();
      this.customerForm.get('shippingCountry')?.disable();
      this.customerForm.get('currency')?.disable();
      this.customerForm.get('countryCode')?.disable();
    } else {
      this.customerForm.get('billingCountry')?.enable();
      this.customerForm.get('shippingCountry')?.enable();
      this.customerForm.get('currency')?.enable();
      this.customerForm.get('countryCode')?.enable();
    }
  }

  onSelectbillingCountry(e: any) {
    this.customerForm.get('billingCountry')?.setValue(e?.target?.innerText);
  }
  onSelectshippingCountry(e: any) {
    this.customerForm.get('shippingCountry')?.setValue(e?.target?.innerText);
  }
  onSelectCurrency(e: any) {
    this.customerForm.get('currency')?.setValue(e?.target?.innerText);
  }
  //TO GET THE VENDOR DATA
  getCustomerData(customerId: number) {
    this.customerService.getCustomerData(customerId).subscribe(
      (response: any) => {
        this.customerData = response;
        this.patchCustomerData(response);
        if (response.shippingAddressLine1 == response.billingAddressLine1) {
          this.copyBillingToShipping(true);
        }
        const selectedType = this.customerForm.get('customerType')?.value;
        if (selectedType) {
          this.onCustomerTypeChange({ target: { value: selectedType } });
          this.customerForm.get('customerType')?.disable();
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
      customerType: this.customerForm.get('customerType')?.value,
      customerCode: this.customerForm.get('customerCode')?.value,
      customerName: this.customerForm.get('customerName')?.value,
      billingAddressLine1: this.customerForm.get('billingAddressLine1')?.value,
      billingAddressLine2: this.customerForm.get('billingAddressLine2')?.value,
      billingCity: this.customerForm.get('billingCity')?.value,
      billingState: this.customerForm.get('billingState')?.value,
      billingCountry: this.customerForm.get('billingCountry')?.value,
      billingPinCode: this.customerForm.get('billingPinCode')?.value,
      shippingAddressLine1: this.customerForm.get('shippingAddressLine1')
        ?.value,
      shippingAddressLine2: this.customerForm.get('shippingAddressLine2')
        ?.value,
      shippingCity: this.customerForm.get('shippingCity')?.value,
      shippingState: this.customerForm.get('shippingState')?.value,
      shippingCountry: this.customerForm.get('shippingCountry')?.value,
      shippingPinCode: this.customerForm.get('shippingPinCode')?.value,
      pan: this.customerForm.get('pan')?.value,
      gst: this.customerForm.get('gst')?.value,
      gstTreatment: this.customerForm.get('gstTreatment')?.value,
      msmeRegistered: this.customerForm.get('msmeRegistered')?.value,
      msmeType: this.customerForm.get('msmeType')?.value,
      msmeNo: this.customerForm.get('msmeNo')?.value,
      contactPersonName: this.customerForm.get('contactPersonName')?.value,
      designation: this.customerForm.get('designation')?.value,
      email1: this.customerForm.get('email1')?.value,
      email2: this.customerForm.get('email2')?.value,
      countryCode: this.customerForm.get('countryCode')?.value,
      phoneMobileNo: this.customerForm.get('phoneMobileNo')?.value,
      currency: this.customerForm.get('currency')?.value,
      paymentTerms: this.customerForm.get('paymentTerms')?.value,
      status: this.customerForm.get('status')?.value,
    };

    if (this.customerId == 0) {
      this.loadSpinner = true;
      this.customerService.createCustomer(data).subscribe(
        (response: any) => {
          this.customerData = response;
          this.loadSpinner = false;
          this.toastr.success('Customer Created Successfully');
          this.router.navigate(['/master/customer']);
        },
        () => {
          //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
          this.loadSpinner = false;
        }
      );
    } else {
      this.customerService.updateCustomer(this.queryData, data).subscribe(
        (response: any) => {
          this.customerData = response;
          this.toastr.success('Customer Update Successfully');
          this.router.navigate(['master/customer']);
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
    this.router.navigate(['master/customer']);
  }

  patchCustomerData(data: any) {
    setTimeout(() => {}, 1000);
    this.selectedTransactionTypes.clear();
    this.customerForm.patchValue({
      customerType: data?.customerType,
      customerName: data?.customerName,
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
      status: data?.status,
    });
  }

  onOptionSelected(event: any) {
    this.customerForm.patchValue({});
  }

  validateNo(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  phoneNumberLength(e: any) {
    const phoneControl = this.customerForm.get('phone');
  }

  onStatusChange(status: string, transaction: any) {
    transaction.disabled = status === 'Inactive';
  }

  copyBillingToShipping(event: any) {
    let isChecked: boolean;

    if (typeof event === 'boolean') {
      isChecked = event; // coming from code
      this.customerForm.get('sameAsBilling')?.setValue(true);
    } else {
      isChecked = event.target.checked; // coming from checkbox event
    }

    if (isChecked) {
      this.customerForm.patchValue({
        shippingAddressLine1: this.customerForm.get('billingAddressLine1')
          ?.value,
        shippingAddressLine2: this.customerForm.get('billingAddressLine2')
          ?.value,
        shippingCountry: this.customerForm.get('billingCountry')?.value,
        shippingCity: this.customerForm.get('billingCity')?.value,
        shippingState: this.customerForm.get('billingState')?.value,
        shippingPinCode: this.customerForm.get('billingPinCode')?.value,
      });

      this.customerForm.get('shippingAddressLine1')?.disable();
      this.customerForm.get('shippingAddressLine2')?.disable();
      this.customerForm.get('shippingCountry')?.disable();
      this.customerForm.get('shippingCity')?.disable();
      this.customerForm.get('shippingState')?.disable();
      this.customerForm.get('shippingPinCode')?.disable();
    } else {
      this.customerForm.get('shippingAddressLine1')?.enable();
      this.customerForm.get('shippingAddressLine2')?.enable();
      this.customerForm.get('shippingCountry')?.enable();
      this.customerForm.get('shippingCity')?.enable();
      this.customerForm.get('shippingState')?.enable();
      this.customerForm.get('shippingPinCode')?.enable();

      this.customerForm.patchValue({
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
