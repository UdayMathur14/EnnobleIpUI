import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../../../core/service/customer.service';
import { ToastrService } from 'ngx-toastr';
import { VendorService } from '../../../../core/service/vendor.service';
import { DispatchNoteService } from '../../../../core/service/dispatch-note.service';
import { LookupService } from '../../../../core/service/lookup.service';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CountryService } from '../../../../core/service/country.service';
import { TransactionTypesService } from '../../../../core/service/transactionTypes.service';

@Component({
  selector: 'app-add-edit-dispatch-note1',
  templateUrl: './add-edit-dispatch-note1.component.html',
  styleUrls: ['./add-edit-dispatch-note1.component.scss'],
})
export class AddEditDispatchNoteComponent1 {
  activeSection = 'professional'; // or 'govt'
  subFeeOptionsList: any[] = [];
  countryList: any = [];
  currencyList: any = [];
  transactionTypesList: any = [];
  selectedVendorCountry: string = '';
  currencySymbol: string = '';
  selectedCustomerCountry: string = '';
  addOrEditDispatchNoteForm!: FormGroup;
  vendorsList: any[] = [];
  customerNum: string | undefined;
  customersList: any[] = [];
  allcustomersNames: string[] = [];
  dispatchNote!: any;
  supplierList: any[] = [];
  customerDetailsList: any[] = []; //just to show customer data on table
  lookupList: any[] = [];
  selectedcustomerNumber!: string;
  selectedQuantity!: number;
  statusTab: boolean = false;
  dispatchId: number = 0;
  loadSpinner: boolean = false;
  selectedcustomers: any = [];
  languageList: any[] = [];
  isTranslationFeeSelected: boolean = false;
  LanguageList: any = [];
  dispatchNotes: any = [];
  dispatchLocationId: number = 0;

  activeTransportersList: any = [];
  // frlrDate!: NgbDateStruct | null;
  today = inject(NgbCalendar).getToday();

  filteredcustomers: any = [];
  invoiceFeeDetailsList: any[] = [];
  paymentFeeDetailsList: any[] = [];
  salesDetailsList: any[] = [];
  govtDetailsList: any[] = [];

  selectedParts: any = [];
  deletedParts: any[] = [];

  selectedSales: any = [];
  deletedSales: any[] = [];

  selectedPayment: any = [];
  deletedPayment: any[] = [];
  customerSymbol: string = '';
  minDate!: NgbDateStruct;
  maxDate!: NgbDateStruct;

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private vendorService: VendorService,
    private dispatchNoteService: DispatchNoteService,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private countryService: CountryService,
    private transactionType: TransactionTypesService
  ) {}

  ngOnInit() {
    this.getVendorsList();
    // this.createFeesGroup();
    this.initForm();
    this.markTab1FieldsTouched();
    this.dispatchId = Number(
      this.activatedRoute.snapshot.paramMap.get('dispatchId')
    );

    this.setDateLimits();
    this.getLanguageList();
    this.getCountryList();
    this.getPaymentCurrencyList();
    if (this.dispatchId == 0) {
      this.statusTab = false;
    }
    if (this.dispatchId > 0) {
      this.statusTab = true;
    }

    this.invoiceFeeDetails.valueChanges.subscribe(() => {
      this.calculateTotals();
    });
    if (this.dispatchId === 0) {
      this.createInvoiceFeeDetailsGroup();
    }

    // this.getAllcountyListInit();
    this.getAllTransactionTypes();
    this.getFilteredCustomersList();
    this.dispatchNoteInit();
    this.tab1Controls;
    this.tab2Controls;
    this.tab3Controls;
    this.tab4Controls;

    setTimeout(() => {
      if (this.dispatchId > 0) {
        this.getDispatchData(this.dispatchId);
      }
    }, 1000);
  }

  initForm() {
    this.addOrEditDispatchNoteForm = this.fb.group({
      //tab1
      vendorId: ['', Validators.required], // Maps to [VendorID]
      selectedVendorCountry: [''],
      invoiceDate: ['', Validators.required], // Maps to [InvoiceDate]
      fy: [{ value: '', disabled: true }, Validators.required], // Maps to [FY]
      clientInvoiceNo: ['', Validators.required], // Maps to [ClientInvoiceNo]
      dueDateAsPerInvoice: ['', Validators.required], // Maps to [DueDateAsPerInvoice]
      creditDaysAsPerContract: [0], // Maps to [CreditDaysAsPerContract]
      dueDateAsPerContract: [{ value: null, disabled: true }], // Maps to [CreditDaysAsPerContract]
      customerId: ['', Validators.required], // Maps to [CustomerID]
      applicantDetails: this.fb.array([]),
      description: [''], // Maps to [Description]
      title: ['', Validators.required], // Maps to [Title]
      applicationNumber: ['', Validators.required], // Maps to [ApplicationNumber]
      filingDate: [''],
      clientRefNo: ['', Validators.required], // Maps to [ClientRefNo]
      ourRefNo: ['', Validators.required], // Maps to [OurRefNo]
      officialFilingReceiptSupporting: ['', Validators.required], //
      workDeliveryDateOrMonth: [''], // Maps to [WorkDeliveryDateOrMonth]
      purchaseCurrency: ['', Validators.required],
      postedInTally: ['', Validators.required],
      patentNo: [''], // Maps to [CurrencyPID]

      //tab2
      invoiceFeeDetails: this.fb.array([]),

      professionalFeeAmt: [{ value: 0, disabled: true }], // Initialize with 0 and disable
      govtOrOfficialFeeAmt: [{ value: 0, disabled: true }], // Initialize with 0 and disable
      otherChargesAmt: [{ value: 0, disabled: true }],
      discountAmt: [0], // Initialize with 0, user enters
      discountCreditNoteAmt: [0], // Initialize with 0, user enters
      totalAmount: [{ value: 0, disabled: true }],
      creditNoteNo: [''],
      creditNoteDate: [''],
      creditNoteRefNo: [''],

      //Tab 3
      paymentFeeDetails: this.fb.array([]),

      //tab4
      customerPONo: [''],
      poDate: [''], // Maps to [PODate]
      poValueInclusiveTaxes: [''],
      saleCurrency: [{ value: '', disabled: true }, Validators.required],

      salesInvoiceDetails: this.fb.array([]),
      status: [''],
    });

    this.invoiceFeeDetails.valueChanges.subscribe(() => {
      this.calculateTotals();
    });

    // Subscribe to changes in discountAmt
    this.addOrEditDispatchNoteForm
      .get('discountAmt')
      ?.valueChanges.subscribe(() => {
        this.calculateTotals();
      });

    // Subscribe to changes in discountCreditNoteAmt
    this.addOrEditDispatchNoteForm
      .get('discountCreditNoteAmt')
      ?.valueChanges.subscribe(() => {
        this.calculateTotals();
      });
  }

  setDateLimits() {
    this.minDate = { year: 2000, month: 1, day: 1 };
    this.maxDate = { year: 2099, month: 12, day: 31 };
  }

  onVendorSelect(selectedVendorCode: string) {
    // Find vendor details from vendorsList
    const vendorDetail = this.vendorsList.find(
      (v) => v.id === selectedVendorCode
    );

    if (vendorDetail) {
      // Pick billingCountry from the vendor detail
      this.selectedVendorCountry = vendorDetail.billingCountry;
      this.currencySymbol = vendorDetail.currencySymbol;
      this.addOrEditDispatchNoteForm.patchValue({
        purchaseCurrency: vendorDetail.currency,
      });
      this.addOrEditDispatchNoteForm.patchValue({
        currencySymbol: vendorDetail.currencySymbol,
      });
    } else {
      this.selectedVendorCountry = '';
      this.addOrEditDispatchNoteForm.patchValue({
        purchaseCurrency: null,
      });
      this.addOrEditDispatchNoteForm.patchValue({
        currencySymbol: null,
      });
    }
  }

  onCustomerSelect(selectedcustomerCode: string) {
    // Find vendor details from vendorsList
    const customerDetail = this.customersList.find(
      (v) => v.id === selectedcustomerCode
    );

    if (customerDetail) {
      // Pick billingCountry from the vendor detail
      this.selectedCustomerCountry = customerDetail.billingCountry;
      this.customerSymbol = customerDetail.currencySymbol;
      this.addOrEditDispatchNoteForm.patchValue({
        saleCurrency: customerDetail.currency,
      });
      this.addOrEditDispatchNoteForm.patchValue({
        customerSymbol: customerDetail.currencySymbol,
      });
    } else {
      this.selectedCustomerCountry = '';
      this.addOrEditDispatchNoteForm.patchValue({
        saleCurrency: null,
      });
      this.addOrEditDispatchNoteForm.patchValue({
        customerSymbol: null,
      });
    }
  }

  get applicantDetails(): FormArray {
    return this.addOrEditDispatchNoteForm.get(
      'applicantDetails'
    ) as FormArray;
  }
  getApplicantNameControl(applicantGroup: FormGroup): FormControl {
    return applicantGroup.get('applicantName') as FormControl;
  }

  // This method now adds a FormGroup to the FormArray
  addApplicantField(): void {
    const applicantGroup = this.fb.group({
      id: [0],
      applicantName: ['', Validators.required], // Added a required validator for demonstration
    });
    this.applicantDetails.push(applicantGroup);
  }

  removeApplicant(index: number): void {
    this.applicantDetails.removeAt(index);
  }

  // This method now returns a 2D array of FormGroups
  getApplicantsRows(): FormGroup[][] {
    const rows: FormGroup[][] = [];
    const controls = this.applicantDetails.controls as FormGroup[];

    for (let i = 0; i < controls.length; i += 4) {
      rows.push(controls.slice(i, i + 4));
    }

    return rows;
  }

  // TrackBy functions for better performance
  trackByRowIndex(index: number, row: FormGroup[]): number {
    return index;
  }

  trackByControlIndex(index: number, applicantGroup: FormGroup): number {
    // You can use the form control object itself as a stable identifier
    return index;
  }

  getFilteredCustomersList(
    offset: number = 0,
    count: number = 0,
    filters: any = ''
  ) {
    let data = {
      customerCode: filters?.customerCode || '',
      customerName: filters?.customerName || '',
      status: 'Active',
    };
    this.customerService.getCustomers(data, offset, count).subscribe(
      (response: any) => {
        console.log(response);
        this.customersList = response.customers;
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }

  getDispatchData(dispatchId: number): void {
    this.loadSpinner = true;
    this.dispatchNoteService.getDispatchNoteById(dispatchId).subscribe(
      (res: any) => {
        // Save the result to a class variable
        this.patchInvoiceData(res);
        this.loadSpinner = false;
      },
      (err) => {
        console.error('Error fetching dispatch data', err);
        this.loadSpinner = false;
      }
    );
  }

  patchInvoiceData(data: any): void {
    this.currencySymbol = data?.vendorDetails?.currencySymbol;
    this.customerSymbol = data?.customerDetails?.currencySymbol;
    this.addOrEditDispatchNoteForm.patchValue({
      // Tab 1
      vendorId: data?.vendorID,
      selectedVendorCountry: data?.vendorDetails?.billingCountry,
      currencySymbol: data?.vendorDetails?.currencySymbol,
      customerSymbol: data?.customerDetails?.currencySymbol,
      invoiceDate: this.convertToNgbDate(data?.invoiceDate),
      fy: data?.fy,
      clientInvoiceNo: data?.clientInvoiceNo,
      dueDateAsPerInvoice: this.convertToNgbDate(data?.dueDateAsPerInvoice),
      creditDaysAsPerContract: data?.creditDaysAsPerContract,
      dueDateAsPerContract: this.convertToNgbDate(data?.dueDateAsPerContract),
      customerId: data?.customerID,
      description: data?.description,
      title: data?.title,
      applicationNumber: data?.applicationNumber,
      filingDate: this.convertToNgbDate(data?.filingDate),
      clientRefNo: data?.clientRefNo,
      ourRefNo: data?.ourRefNo,
      officialFilingReceiptSupporting: data?.officialFilingReceiptSupporting,
      postedInTally: data?.postedInTally,
      patentNo: data?.patentNo,
      workDeliveryDateOrMonth: this.convertToNgbDate(
        data?.workDeliveryDateOrMonth
      ),
      purchaseCurrency: data?.purchaseCurrency,

      //Tab 2
      paymentFeeDetails: data?.paymentDetails,
      discountAmt: data?.discountAmt ?? 0,
      discountCreditNoteAmt: data?.discountCreditNoteAmt ?? 0,
      creditNoteNo: data?.creditNoteNo,
      creditNoteDate: this.convertToNgbDate(data?.creditNoteDate),
      creditNoteRefNo: data?.creditNoteRefNo,

      // Tab 4
      customerPONo: data?.customerPONo,
      poDate: this.convertToNgbDate(data?.pODate),
      poValueInclusiveTaxes: data?.pOValueInclusiveTaxes,
      saleCurrency: data?.saleCurrency,
      salesInvoiceDetails: data?.saleDetails,
      status: data?.status,
      // Charges tab

      // Total is calculated, not patched
    });

    this.applicantDetails.clear();
    data.nameDetails?.forEach((name: any) => {
      this.applicantDetails.push(
        this.fb.group({
          id: name.id,
          applicantName: [name.applicantName, Validators.required],
        })
      );
    });

    this.invoiceFeeDetails.clear();
    data.feeDetails?.forEach((fee: any) => {
      this.invoiceFeeDetails.push(
        this.fb.group({
          id: fee.id,
          feeType: [fee.feeType, Validators.required],
          subFeeValue: [fee.subFeeValue, Validators.required],
          country: [fee.country, Validators.required],
          language: [fee.language],
          amount: [fee.amount, Validators.required],
          remarks: [fee.remarks],
        })
      );
    });

    this.paymentFeeDetails.clear();
    data.paymentDetails?.forEach((fee: any) => {
      // 1. Create a new FormGroup with patched values
      const newFeeGroup = this.fb.group({
        id: fee.id,
        paymentDate: [
          fee.paymentDate ? this.convertToNgbDate(fee.paymentDate) : null,
          Validators.required,
        ],
        bankID: [fee.bankID, Validators.required],
        owrmNo1: [fee.oWRMNo1, Validators.required],
        rate: [fee.rate, Validators.required],
        quantity: [fee.quantity, Validators.required],
        paymentCurrency: [fee.paymentCurrency, Validators.required],
        // Patch the value directly without the 'disabled' property
        paymentAmount: [fee.paymentAmount, Validators.required],
        bankCharges: [fee.bankcharges ?? 0, Validators.required], // Corrected casing to match C#
        totalAmountInr: [fee.totalAmountInr, Validators.required],
      });

      this.paymentFeeDetails.push(newFeeGroup);

      // 3. Manually call the calculation function for the newly created row
      this.calculateRowValues(newFeeGroup);

      // 4. Then, subscribe to future changes
      this.setupSubscriptions(newFeeGroup);
    });

    this.salesInvoiceDetails.clear();
    data.saleDetails?.forEach((sale: any) => {
      const group = this.fb.group({
        id: [sale.id],
        type: [sale.type],
        invoiceNo: [sale.invoiceNo],
        amount: [sale.amount],
        estimateNo: [sale.estimateNo],
        saleInvoiceDate: [
          sale?.saleinvoiceDate
            ? this.convertToNgbDate(sale.saleinvoiceDate)
            : '',
        ],
        remarks: [sale.remarks],
        postedInTally: [sale.postedInTally],
      });
      console.log(group.value);
      const amountCtrl = group.get('invoiceNo');
      const estimateCtrl = group.get('estimateNo');

      let isProgrammaticChange = false;

      // === Value change listeners ===
      amountCtrl?.valueChanges.subscribe((value) => {
        if (isProgrammaticChange) return;
        if (value != '') {
          isProgrammaticChange = true;
          estimateCtrl?.reset();
          estimateCtrl?.disable();
          isProgrammaticChange = false;
        } else {
          estimateCtrl?.enable();
        }
      });

      estimateCtrl?.valueChanges.subscribe((value) => {
        if (isProgrammaticChange) return;
        if (value != '') {
          isProgrammaticChange = true;
          amountCtrl?.reset();
          amountCtrl?.disable();
          isProgrammaticChange = false;
        } else {
          amountCtrl?.enable();
        }
      });

      // === Apply disable logic based on existing values ===
      if (sale.invoiceNo) {
        estimateCtrl?.disable({ emitEvent: false });
      } else if (sale.estimateNo) {
        amountCtrl?.disable({ emitEvent: false });
      }

      this.salesInvoiceDetails.push(group);
    });
    this.addOrEditDispatchNoteForm
      .get('dueDateAsPerContract')
      ?.setValue(this.convertToNgbDate(data?.dueDateAsPerContract));
    // Optional: Patch totals (only if you store them)
    this.addOrEditDispatchNoteForm.patchValue({
      professionalFeeAmt: data?.professionalFeeAmt ?? 0,
      govtOrOfficialFeeAmt: data?.govtOrOfficialFeeAmt ?? 0,
      otherChargesAmt: data?.otherChargesAmt ?? 0,
      totalAmount: data?.totalAmount ?? 0,
    });
  }

  mapQuantities(qtyId: any) {
    const lookupItem = this.lookupList.find((lookup) => qtyId === lookup.id);
    return lookupItem?.id;
  }
  getVendorsList(offset: number = 0, count: number = 0, filters: any = '') {
    let data = {
      vendorName: filters?.vendorName || '',
      vendorCode: filters?.vendorCode || '',
      vendorType: filters?.vendorType || '',
      status: 'Active',
    };
    this.vendorService.getVendors(data, offset, count).subscribe(
      (response: any) => {
        this.vendorsList = response.vendors;
        this.loadSpinner = false;
        // this.allVendorNames = response.vendors.map((vendor: any) => vendor.vendorName);
      },
      (error) => {
        this.loadSpinner = false;
        this.toastr.error();
      }
    );
  }

  // private async getAllcountyListInit() {
  //   var data = {};
  //   this.countryService.getCountryData(data).subscribe(
  //     (response: any) => {
  //       this.countryList = response.countrys;
  //       console.log(this.countryList);
  //       this.loadSpinner = false;
  //     },
  //     () => {
  //       //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
  //       this.loadSpinner = false;
  //     }
  //   );
  // }

  getAllTransactionTypes(
    offset: number = 0,
    count: number = 0,
    filters: any = ''
  ) {
    let data = {
      bankCode: filters?.transactionTypeCode || '',
      bankName: filters?.transactionTypeName || '',
      status: 'Active',
    };
    this.transactionType.getTransactionTypes(data, offset, count).subscribe(
      (response: any) => {
        console.log(response);
        this.transactionTypesList = response.banks;
      },
      (error) => {
        // this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }
  // Example function - call this whenever invoice date or due days change
  calculateDueDate() {
    const invoiceDateStruct =
      this.addOrEditDispatchNoteForm.get('invoiceDate')?.value;
    const creditDays = this.addOrEditDispatchNoteForm.get(
      'creditDaysAsPerContract'
    )?.value;

    if (invoiceDateStruct && creditDays != null && !isNaN(creditDays)) {
      const invoiceDate = new Date(
        invoiceDateStruct.year,
        invoiceDateStruct.month - 1,
        invoiceDateStruct.day
      );

      invoiceDate.setDate(invoiceDate.getDate() + Number(creditDays));

      const dueDateStruct = {
        year: invoiceDate.getFullYear(),
        month: invoiceDate.getMonth() + 1,
        day: invoiceDate.getDate(),
      };

      this.addOrEditDispatchNoteForm
        .get('dueDateAsPerContract')
        ?.setValue(dueDateStruct);
    } else {
      this.addOrEditDispatchNoteForm
        .get('dueDateAsPerContract')
        ?.setValue(null);
    }
  }

  onInvoiceDateChange(event: any) {
    if (event && event.year) {
      const fy = `${event.year}-${event.year + 1}`; // Example: FY 2025-2026
      this.addOrEditDispatchNoteForm.get('fy')?.setValue(fy);
      this.addOrEditDispatchNoteForm.get('fy')?.disable(); // disable the field
    }
    this.calculateDueDate();
  }

  onCreditDaysChange() {
    this.calculateDueDate();
  }

  onCancelPress() {
    this.router.navigate(['transaction/SalesInvoiceTxn']);
  }

  convertToNgbDate(dateString: string): NgbDateStruct | null {
    if (!dateString) return null;
    const date = new Date(dateString);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1, // 0-based month in JS
      day: date.getDate(),
    };
  }
  private dispatchNoteInit() {
    this.dispatchNote = {
      actionBy: localStorage.getItem('userId'),
      attribute1: '',
      attribute2: '',
      attribute3: '',
      attribute4: '',
      attribute5: 0,
      attribute6: 0,
      attribute7: 0,
      attribute8: 0,
      attribute9: new Date(),
      attribute10: new Date(),
      frlrNumber: '',
      supplierId: 0,
      vehicleId: 0,
      customerDetails: [],
      id: this.dispatchId,
      transporterId: 0,
      frlrDate: '',
      transporterMode: '',
      invoiceFeeDetails: [],
      paymentFeeDetails: [],
      saleProfessionalInvoices: [],
      saleGovtInvoices: [],
      applicantDetails: [],
    };
  }

  getFilteredcustomerNumbers(index: number) {
    return this.filteredcustomers.filter(
      (customers: any) =>
        !this.selectedcustomers.includes(customers.customerNumber)
    );
  }

  initializeSelectedcustomers(selectedcustomerNumbers: string[]) {
    this.selectedcustomers = selectedcustomerNumbers;
  }

  formatDate(dateObj: any): string | null {
    if (!dateObj || !dateObj.year || !dateObj.month || !dateObj.day)
      return null;

    const year = dateObj.year;
    const month = ('0' + dateObj.month).slice(-2); // Ensure two digits
    const day = ('0' + dateObj.day).slice(-2);

    return `${year}-${month}-${day}`;
  }

  get tab1Controls() {
    return this.addOrEditDispatchNoteForm.controls;
  }

  get tab2Controls() {
    return (
      this.addOrEditDispatchNoteForm.get('invoiceFeeDetails') as FormArray
    ).controls;
  }

  get tab3Controls() {
    return (
      this.addOrEditDispatchNoteForm.get('paymentFeeDetails') as FormArray
    ).controls; // pick specific tab3 fields in check
  }

  get tab4Controls() {
    return this.addOrEditDispatchNoteForm.controls; // pick tab4 related fields
  }

  isTab1Touched(): boolean {
    const tab1Fields = [
      'vendorId',
      'invoiceDate',
      'fy',
      'clientInvoiceNo',
      'customerId',
      'title',
      'applicationNumber',
      'clientRefNo',
      'ourRefNo',
      'officialFilingReceiptSupporting',
      'postedInTally',
      'purchaseCurrency',
    ];
    return tab1Fields.some(
      (field) => this.addOrEditDispatchNoteForm.get(field)?.value
    );
  }

  isTab1Invalid(): boolean {
    const tab1Fields = [
      'vendorId',
      'invoiceDate',
      'fy',
      'clientInvoiceNo',
      'customerId',
      'title',
      'applicationNumber',
      'clientRefNo',
      'ourRefNo',
      'officialFilingReceiptSupporting',
      'purchaseCurrency',
      'postedInTally',
      'applicantDetails',
    ];
    return tab1Fields.some(
      (field) => this.addOrEditDispatchNoteForm.get(field)?.invalid
    );
  }
  isTab2Touched(): boolean {
    return this.invoiceFeeDetails.length > 0;
  }

  isTab2Invalid(): boolean {
    return (
      this.isTab2Touched() &&
      (
        this.addOrEditDispatchNoteForm.get(
          'invoiceFeeDetails'
        ) as FormArray
      ).controls.some((group) => group.invalid)
    );
  }
  isTab3Touched(): boolean {
    return this.invoiceFeeDetails.length > 0;
  }

  isTab3Invalid(): boolean {
    return (
      this.isTab2Touched() &&
      (
        this.addOrEditDispatchNoteForm.get(
          'paymentFeeDetails'
        ) as FormArray
      ).controls.some((group) => group.invalid)
    );
  }

  isTab4Touched(): boolean {
    const tab4Fields = ['nk'];
    return tab4Fields.some(
      (field) => this.addOrEditDispatchNoteForm.get(field)?.value
    );
  }

  isTab4Invalid(): boolean {
    const salesInvoiceDetails =
      this.addOrEditDispatchNoteForm.get('salesInvoiceDetails')?.value ||
      [];

    // List empty → valid (no error)
    if (salesInvoiceDetails.length === 0) {
      return false;
    }

    // Agar koi row hai jisme invoiceNo bhi blank hai aur estimateNo bhi blank hai → invalid
    const hasInvalidRow = salesInvoiceDetails.some(
      (row: any) =>
        (!row.invoiceNo || row.invoiceNo.toString().trim() === '') &&
        (!row.estimateNo || row.estimateNo.toString().trim() === '')
    );

    return hasInvalidRow;
  }

  markTab1FieldsTouched() {
    console.log('Marking Tab 1 fields as touched');
    const tab1Fields = [
      'vendorId',
      'invoiceDate',
      'fy',
      'clientInvoiceNo',
      'customerId',
      'title',
      'applicationNumber',
      'clientRefNo',
      'ourRefNo',
      'officialFilingReceiptSupporting',
      'purchaseCurrency',
    ];

    tab1Fields.forEach((field) => {
      const control = this.addOrEditDispatchNoteForm.get(field);
      if (control) {
        control.markAsTouched(); // 👈 Required
        control.updateValueAndValidity();
      }
    });
  }

  async onSavePress() {
    this.loadSpinner = true;

    if (this.isTab1Invalid()) {
      this.toastr.warning('Please complete all required fields in Tab 1');
      this.loadSpinner = false;
      return;
    }

    if (this.isTab2Invalid()) {
      this.toastr.warning('Please complete all Invoice Fee fields in Tab 2');
      this.loadSpinner = false;
      return;
    }

    if (this.isTab3Invalid()) {
      this.toastr.warning('Please complete all fields in Tab 3');
      this.loadSpinner = false;
      return;
    }

    if (this.isTab4Invalid()) {
      this.toastr.warning('Please complete all fields in Tab 4');
      this.loadSpinner = false;
      return;
    }
    // Build invoice object from form values
    const invoiceData: any = {
      //tab 1
      vendorId:
        this.addOrEditDispatchNoteForm.controls['vendorId'].value || null,
      invoiceDate: this.formatDate(
        this.addOrEditDispatchNoteForm.controls['invoiceDate'].value
      ),
      fy: this.addOrEditDispatchNoteForm.controls['fy'].value,
      clientInvoiceNo:
        this.addOrEditDispatchNoteForm.controls['clientInvoiceNo'].value,
      dueDateAsPerInvoice: this.formatDate(
        this.addOrEditDispatchNoteForm.controls['dueDateAsPerInvoice']
          .value
      ),

      creditDaysAsPerContract: Number(
        this.addOrEditDispatchNoteForm.controls['creditDaysAsPerContract']
          .value
      ),
      customerId: Number(
        this.addOrEditDispatchNoteForm.controls['customerId'].value || null
      ),
      VendorApplicantNames:
        this.addOrEditDispatchNoteForm.get('applicantDetails')?.value ||
        [],
      description:
        this.addOrEditDispatchNoteForm.controls['description'].value,
      title: this.addOrEditDispatchNoteForm.controls['title'].value,
      applicationNumber:
        this.addOrEditDispatchNoteForm.controls['applicationNumber'].value,
      filingDate: this.formatDate(
        this.addOrEditDispatchNoteForm.controls['filingDate'].value
      ),
      clientRefNo:
        this.addOrEditDispatchNoteForm.controls['clientRefNo'].value,
      ourRefNo: this.addOrEditDispatchNoteForm.controls['ourRefNo'].value,
      officialFilingReceiptSupporting:
        this.addOrEditDispatchNoteForm.controls[
          'officialFilingReceiptSupporting'
        ].value,
      postedInTally:
        this.addOrEditDispatchNoteForm.controls['postedInTally'].value,

      patentNo: this.addOrEditDispatchNoteForm.controls['patentNo'].value,
      creditNoteNo:
        this.addOrEditDispatchNoteForm.controls['creditNoteNo'].value,
      creditNoteDate: this.formatDate(
        this.addOrEditDispatchNoteForm.controls['creditNoteDate'].value
      ),
      creditNoteRefNo:
        this.addOrEditDispatchNoteForm.controls['creditNoteRefNo'].value,

      workDeliveryDateOrMonth: this.formatDate(
        this.addOrEditDispatchNoteForm.controls['workDeliveryDateOrMonth']
          .value
      ),
      purchaseCurrency:
        this.addOrEditDispatchNoteForm.controls['purchaseCurrency'].value,

      //tab2
      invoiceFeeDetails:
        this.addOrEditDispatchNoteForm.get('invoiceFeeDetails')?.value ||
        [],
      // paymentFeeDetails:
      //   this.addOrEditDispatchNoteForm.get('paymentFeeDetails')?.value ||
      //   [],

      professionalFeeAmt: Number(
        this.addOrEditDispatchNoteForm.controls['professionalFeeAmt']
          ?.value
      ),
      paymentFeeDetails:
        this.addOrEditDispatchNoteForm.value.paymentFeeDetails?.map(
          (fee: any) => ({
            ...fee,
            paymentDate: this.formatDate(fee.paymentDate),
          })
        ) || [],

      govtOrOfficialFeeAmt: Number(
        this.addOrEditDispatchNoteForm.controls['govtOrOfficialFeeAmt']
          ?.value
      ),
      otherChargesAmt: Number(
        this.addOrEditDispatchNoteForm.controls['otherChargesAmt']?.value
      ),
      discountAmt: Number(
        this.addOrEditDispatchNoteForm.controls['discountAmt']?.value
      ),
      discountCreditNoteAmt: Number(
        this.addOrEditDispatchNoteForm.controls['discountCreditNoteAmt']
          ?.value
      ),
      totalAmount: Number(
        this.addOrEditDispatchNoteForm.controls['totalAmount']?.value
      ),

      customerPONo:
        this.addOrEditDispatchNoteForm.controls['customerPONo'].value,
      poDate: this.formatDate(
        this.addOrEditDispatchNoteForm.controls['poDate'].value
      ),
      poValueInclusiveTaxes: Number(
        this.addOrEditDispatchNoteForm.controls['poValueInclusiveTaxes']
          .value
      ),

      saleCurrency:
        this.addOrEditDispatchNoteForm.controls['saleCurrency'].value,

      salesInvoiceDetails:
        this.addOrEditDispatchNoteForm.value.salesInvoiceDetails?.map(
          (date: any) => ({
            ...date,
            saleInvoiceDate: this.formatDate(date.saleInvoiceDate),
          })
        ) || [],

      createdBy: '',
      status: this.addOrEditDispatchNoteForm.controls['status'].value, // Add dynamically if required
    };

    // Check if it's an update or create
    if (this.dispatchId > 0) {
      // UPDATE
      this.dispatchNoteService
        .updateDispatchNote(this.dispatchId, invoiceData)
        .subscribe(
          (response: any) => {
            this.toastr.success('Invoice Updated Successfully');
            this.loadSpinner = false;
            this.router.navigate(['transaction/SalesInvoiceTxn']);
          },
          (error) => {
            this.loadSpinner = false;
            // Uncomment below to show detailed error messages
            // this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
          }
        );
    } else {
      // CREATE
      this.dispatchNoteService.createDispatchNote(invoiceData).subscribe(
        (response: any) => {
          this.toastr.success('Invoice Created Successfully');
          this.loadSpinner = false;
          this.router.navigate(['transaction/SalesInvoiceTxn']);
        },
        (error) => {
          this.loadSpinner = false;
          // Uncomment below to show detailed error messages
          // this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        }
      );
    }
  }

  validateNo(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  isFormInvalid() {
    // return !this.addOrEditDispatchNoteForm.controls['locationId']?.value
    // || !this.addOrEditDispatchNoteForm.controls['supplierCode']?.value ||
    // !this.addOrEditDispatchNoteForm.controls['transporterCode']?.value ||
    // !this.addOrEditDispatchNoteForm.controls['transporterMode']?.value ||
    // !this.addOrEditDispatchNoteForm.controls['vehicleNumber']?.value
  }

  getEditData(dispatchNumber: string = ''): void {
    this.loadSpinner = true;
    this.dispatchNoteService
      .getDispatchNote({ dispatchNumber })
      .subscribe((res: any) => {
        this.dispatchNotes = res.dispatchNotes;
        this.getDispatchData(this.dispatchId);
      });
  }

  onDateSelect(type: string, e: any) {
    const month = Number(e.month) < 10 ? '0' + e.month : e.month;
    const day = Number(e.day) < 10 ? '0' + e.day : e.day;
  }

  // Create Row
  createInvoiceFeeDetailsGroup() {
    const detail = this.fb.group({
      id: [0],
      feeType: [''],
      subFeeValue: ['', [Validators.required]],
      country: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      remarks: [''],
      language: [''],
    });

    this.invoiceFeeDetails.push(detail);
    detail.get('feeType')?.valueChanges.subscribe(() => this.calculateTotals());
    detail.get('amount')?.valueChanges.subscribe(() => this.calculateTotals());

    this.calculateTotals();
  }

  get paymentFeeDetails(): FormArray {
    return this.addOrEditDispatchNoteForm.get(
      'paymentFeeDetails'
    ) as FormArray;
  }

  get invoiceFeeDetails(): FormArray {
    return this.addOrEditDispatchNoteForm.get(
      'invoiceFeeDetails'
    ) as FormArray;
  }

  get salesInvoiceDetails(): FormArray {
    return this.addOrEditDispatchNoteForm.get(
      'salesInvoiceDetails'
    ) as FormArray;
  }
  addSaleInvoice(type: string) {
    const today = new Date();
    const group = this.fb.group({
      id: [0],
      type: [type], // 'Professional' or 'Govt'
      invoiceNo: [],
      amount: [null],
      estimateNo: [null],
      saleInvoiceDate: [''],
      remarks: [''],
      postedInTally: [''],
    });

    const amountCtrl = group.get('invoiceNo');
    const estimateCtrl = group.get('estimateNo');

    let isProgrammaticChange = false;

    // Professional Amount listener
    amountCtrl?.valueChanges.subscribe((value) => {
      if (isProgrammaticChange) return;

      if (value != '') {
        isProgrammaticChange = true;
        estimateCtrl?.reset();
        estimateCtrl?.disable();
        isProgrammaticChange = false;
      } else {
        estimateCtrl?.enable();
      }
    });

    // Estimate No listener
    estimateCtrl?.valueChanges.subscribe((value) => {
      if (isProgrammaticChange) return;

      if (value != '') {
        isProgrammaticChange = true;
        amountCtrl?.reset();
        amountCtrl?.disable();
        isProgrammaticChange = false;
      } else {
        amountCtrl?.enable();
      }
    });

    this.salesInvoiceDetails.push(group);
  }
  createPaymentFeeDetailsGroup() {
    const detail = this.fb.group({
      id: [0],
      paymentDate: ['', [Validators.required]],
      bankID: ['', [Validators.required]],
      owrmNo1: ['', [Validators.required]],
      rate: [0, Validators.required],
      quantity: [0, Validators.required],
      paymentCurrency: ['', [Validators.required]],
      paymentAmount: [0],
      bankCharges: [0, Validators.required],
      totalAmountInr: [0],
    });

    this.paymentFeeDetails.push(detail);

    const newFormGroup = this.paymentFeeDetails.at(
      this.paymentFeeDetails.length - 1
    ) as FormGroup;

    this.setupSubscriptions(newFormGroup);
  }

  private setupSubscriptions(group: FormGroup) {
    group.get('rate')!.valueChanges.subscribe(() => {
      this.calculateRowValues(group);
    });

    group.get('quantity')!.valueChanges.subscribe(() => {
      this.calculateRowValues(group);
    });

    group.get('bankCharges')!.valueChanges.subscribe(() => {
      this.calculateRowValues(group);
    });
  }
  private calculateRowValues(group: FormGroup) {
    if (!group) {
      return; // Agar row hi nahi hai toh calculation skip
    }

    // Convert all values to numbers to ensure correct addition
    const rate = parseFloat(group.get('rate')?.value) || 0;
    const quantity = parseFloat(group.get('quantity')?.value) || 0;
    const bankCharges = parseFloat(group.get('bankCharges')?.value) || 0;

    // Calculate Value (INR)
    const paymentAmount = rate * quantity;
    group.get('paymentAmount')?.patchValue(paymentAmount, { emitEvent: false });

    // Calculate Total Amount (INR)
    const totalAmountInr = paymentAmount + bankCharges;
    group
      .get('totalAmountInr')
      ?.patchValue(totalAmountInr, { emitEvent: false });
  }

  filteredSalesInvoices(type: string): FormGroup[] {
    return this.salesInvoiceDetails.controls.filter(
      (ctrl) => ctrl.get('type')?.value === type
    ) as FormGroup[];
  }

  removeSaleInvoice(group: FormGroup) {
    const index = this.salesInvoiceDetails.controls.indexOf(group);
    if (index >= 0) {
      this.salesInvoiceDetails.removeAt(index);
    }
  }

  // Delete Row
  onDeleteInvoiceFeeDetail(InvoiceFeeDetail: any, i: number) {
    this.loadSpinner = true;
    this.invoiceFeeDetails.removeAt(i);
    const InvoiceFeeDetailNumber =
      InvoiceFeeDetail.value.InvoiceFeeDetailNumber;
    const index = this.selectedParts.indexOf(InvoiceFeeDetailNumber);
    if (index > -1) {
      this.selectedParts.splice(index, 1);
    }
    this.subFeeOptionsList.splice(index, 1);
    this.calculateTotals();
    this.loadSpinner = false; // remove corresponding subFee list
  }
  onDeletePaymentFeeDetail(PaymentFeeDetail: any, i: number) {
    this.loadSpinner = true;

    this.loadSpinner = true;
    this.paymentFeeDetails.removeAt(i);
    const PaymentFeeDetailNumber =
      PaymentFeeDetail.value.InvoiceFeeDetailNumber;
    const index = this.selectedPayment.indexOf(PaymentFeeDetailNumber);
    if (index > -1) {
      this.selectedPayment.splice(index, 1);
    }
    this.loadSpinner = false;
  }

  updateSelectedInvoice(selectedInvoiceFeeNumbers: string[]) {
    this.selectedParts = selectedInvoiceFeeNumbers;
  }

  updateSelectedSales(selectedInvoiceFeeNumbers: string[]) {
    this.selectedParts = selectedInvoiceFeeNumbers;
  }

  getSelectedValue(event: Event): string {
    const target = event.target as HTMLSelectElement | null;
    return target?.value || '';
  }

  // On FeeType Change
  onFeeTypeSelect(feeType: string, index: number) {
    this.loadSpinner = true;
    const row = this.invoiceFeeDetails.at(index);
    this.getAllLookupsList(0, feeType, index, row);
    this.loadSpinner = false; // pass just the string
  }

  // In your component class
  calculateTotals() {
    let professionalFeeTotal = 0;
    let govtOrOfficialFeeTotal = 0;
    let otherChargesTotal = 0;

    this.invoiceFeeDetails.controls.forEach((group: AbstractControl) => {
      const feeType = group.get('feeType')?.value;
      const amount = parseFloat(group.get('amount')?.value) || 0; // Convert to number, default to 0 if invalid

      switch (feeType) {
        case 'Professional Fee':
          professionalFeeTotal += amount;
          break;
        case 'Govt or Offical Fee':
          govtOrOfficialFeeTotal += amount;
          break;
        case 'Other Charges':
          otherChargesTotal += amount;
          break;
      }
    });

    this.addOrEditDispatchNoteForm
      .get('professionalFeeAmt')
      ?.patchValue(professionalFeeTotal.toFixed(2)); // Format to 2 decimal places
    this.addOrEditDispatchNoteForm
      .get('govtOrOfficialFeeAmt')
      ?.patchValue(govtOrOfficialFeeTotal.toFixed(2));
    this.addOrEditDispatchNoteForm
      .get('otherChargesAmt')
      ?.patchValue(otherChargesTotal.toFixed(2));
    const discountAmt =
      parseFloat(
        this.addOrEditDispatchNoteForm.get('discountAmt')?.value
      ) || 0;
    const discountCreditNoteAmt =
      parseFloat(
        this.addOrEditDispatchNoteForm.get('discountCreditNoteAmt')?.value
      ) || 0;

    const totalCalculatedAmount =
      professionalFeeTotal +
      govtOrOfficialFeeTotal +
      otherChargesTotal -
      discountAmt -
      discountCreditNoteAmt;

    this.addOrEditDispatchNoteForm
      .get('totalAmount')
      ?.patchValue(totalCalculatedAmount.toFixed(2));
  }

  onFeeTypeChange(index: number) {
    const anyTranslationSelected = this.invoiceFeeDetails.controls.some(
      (group) => group.get('subFeeValue')?.value === 'Translation Fee'
    );
    this.isTranslationFeeSelected = anyTranslationSelected;
  }

  // Allow only numbers
  validateNo1(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  validateDecimal(event: KeyboardEvent) {
    const pattern = /[0-9.]/; // allow numbers and decimal point
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }

    // prevent multiple decimals
    const current: string = (event.target as HTMLInputElement).value;
    if (inputChar === '.' && current.includes('.')) {
      event.preventDefault();
    }
  }
  getAllLookupsList(
    offset: number = 0,
    filters: any = '',
    rowIndex?: number,
    rowControl?: AbstractControl
  ) {
    // Handle both string (feeType) and object (filters) input
    const data = {
      code: typeof filters === 'object' ? filters.code || '' : '',
      lookUpType:
        typeof filters === 'object' ? filters.lookUpType || '' : filters || '',
      value: typeof filters === 'object' ? filters.value || '' : '',
      status:
        typeof filters === 'object'
          ? filters.status !== undefined
            ? filters.status
            : 'Active' // Default to Active
          : 'Active', // If filters is a string, default to Active
    };

    this.loadSpinner = true;
    this.lookupService.getLookupsType(data).subscribe(
      (response: any) => {
        const lookups = response.lookUps || [];

        if (rowIndex !== undefined && rowControl) {
          // Called from FeeType selection
          this.subFeeOptionsList[rowIndex] = lookups;
          rowControl.get('subFeeValue')?.setValue(''); // Clear old value
        }

        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }

  getLanguageList( ) {
    this.loadSpinner = true;
    this.lookupService.getDropdownData('Language').subscribe(
      (response: any) => {
        this.LanguageList = response.lookUps || [];
        console.log(this.LanguageList);
        this.loadSpinner = false;
      }
    );  
  }

  getCountryList( ) {
    this.loadSpinner = true;
    this.lookupService.getDropdownData('Country').subscribe(
      (response: any) => {
        this.countryList = response.lookUps || [];
        this.loadSpinner = false;
      }
    );  
  }

   getPaymentCurrencyList( ) {
    this.loadSpinner = true;
    this.lookupService.getDropdownData('Currency').subscribe(
      (response: any) => {
        this.currencyList = response.lookUps || [];
        this.loadSpinner = false;
      }
    );  
  }
}
