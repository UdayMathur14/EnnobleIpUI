import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
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
  selector: 'app-add-edit-dispatch-note',
  templateUrl: './add-edit-dispatch-note.component.html',
  styleUrl: './add-edit-dispatch-note.component.scss',
})
export class AddEditDispatchNoteComponent {
  activeSection = 'professional'; // or 'govt'
  subFeeOptionsList: any[] = [];
  countryList: any = [];
  transactionTypesList: any = [];
  selectedVendorCountry: string = '';
  addOrEditDispatchNoteFormGroup!: FormGroup;
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
  dispatchId: number = 0;
  loadSpinner: boolean = false;
  selectedcustomers: any = [];
  languageList: any[] = [];
  isTranslationFeeSelected: boolean = false;

  dispatchNotes: any = [];
  dispatchLocationId: number = 0;

  activeTransportersList: any = [];
  // frlrDate!: NgbDateStruct | null;
  today = inject(NgbCalendar).getToday();

  filteredcustomers: any = [];
  invoiceFeeDetailsList: any[] = [];
  salesDetailsList: any[] = [];
  govtDetailsList: any[] = [];

  selectedParts: any = [];
  deletedParts: any[] = [];

  selectedSales: any = [];
  deletedSales: any[] = [];

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

    this.dispatchId = Number(
      this.activatedRoute.snapshot.paramMap.get('dispatchId')
    );

    this.invoiceFeeDetails.valueChanges.subscribe(() => {
      this.calculateTotals();
    });

    this.getAllcountyListInit();
    this.getAllTransactionTypes();
    this.getFilteredCustomersList();
    this.dispatchNoteInit();

    setTimeout(() => {
      if (this.dispatchId > 0) {
        this.getDispatchData(this.dispatchId);
      }
    }, 1000);
  }

  initForm() {
    this.addOrEditDispatchNoteFormGroup = this.fb.group({
      //tab1
      vendorId: [''], // Maps to [VendorID]
      invoiceDate: [''], // Maps to [InvoiceDate]
      fy: [''], // Maps to [FY]
      clientInvoiceNo: [''], // Maps to [ClientInvoiceNo]
      dueDateAsPerInvoice: [''], // Maps to [DueDateAsPerInvoice]
      creditDaysAsPerContract: [''], // Maps to [CreditDaysAsPerContract]
      dueDateAsPerContract: [''], // Maps to [CreditDaysAsPerContract]
      customerId: [''], // Maps to [CustomerID]
      description: [''], // Maps to [Description]
      title: [''], // Maps to [Title]
      applicationNumber: [''], // Maps to [ApplicationNumber]
      filingDate: [''],
      clientRefNo: [''], // Maps to [ClientRefNo]
      ourRefNo: [''], // Maps to [OurRefNo]
      officialFilingReceiptSupporting: [''], // Maps to [OfficialFilingReceiptSupporting]
      workDeliveryDateOrMonth: [''], // Maps to [WorkDeliveryDateOrMonth]
      purchaseCurrency: [''], // Maps to [CurrencyPID]

      //tab2
      invoiceFeeDetails: this.fb.array([]),
      professionalFeeAmt: [{ value: 0, disabled: true }], // Initialize with 0 and disable
      govtOrOfficialFeeAmt: [{ value: 0, disabled: true }], // Initialize with 0 and disable
      otherChargesAmt: [{ value: 0, disabled: true }],
      discountAmt: [0, [Validators.required]], // Initialize with 0, user enters
      discountCreditNoteAmt: [0, [Validators.required]], // Initialize with 0, user enters
      totalAmount: [{ value: 0, disabled: true }],

      //Tab 3
      paymentDate: [''], // Maps to [PaymentDate]
      bankID: [''], // Maps to [BankID]
      owrmNo1: [''], // Maps to [OWRMNo]
      owrmNo2: [''],
      paymentCurrency: [''],
      paymentAmount: [''], // Maps to [CustomerPONo]

      //tab4
      customerPONo: [''],
      poDate: [''], // Maps to [PODate]
      poValueInclusiveTaxes: [''],
      saleCurrency: [''],

      salesInvoiceDetails: this.fb.array([]),
      status: [''],
    });

    this.invoiceFeeDetails.valueChanges.subscribe(() => {
      this.calculateTotals();
    });

    // Subscribe to changes in discountAmt
    this.addOrEditDispatchNoteFormGroup
      .get('discountAmt')
      ?.valueChanges.subscribe(() => {
        this.calculateTotals();
      });

    // Subscribe to changes in discountCreditNoteAmt
    this.addOrEditDispatchNoteFormGroup
      .get('discountCreditNoteAmt')
      ?.valueChanges.subscribe(() => {
        this.calculateTotals();
      });
  }

  onVendorSelect(selectedVendorCode: string) {
    // Find vendor details from vendorsList
    const vendorDetail = this.vendorsList.find(
      (v) => v.id === selectedVendorCode
    );

    if (vendorDetail) {
      // Pick billingCountry from the vendor detail
      this.selectedVendorCountry = vendorDetail.billingCountry;
      this.addOrEditDispatchNoteFormGroup.patchValue({
        purchaseCurrency: vendorDetail.currency,
      });
    } else {
      this.selectedVendorCountry = '';
      this.addOrEditDispatchNoteFormGroup.patchValue({
        purchaseCurrency: null,
      });
    }
  }

  getFilteredCustomersList(
    offset: number = 0,
    count: number = 0,
    filters: any = ''
  ) {
    let data = {
      customerCode: filters?.customerCode || '',
      customerName: filters?.customerName || '',
      status: filters?.status || '',
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
    this.addOrEditDispatchNoteFormGroup.patchValue({
      // Tab 1
      vendorId: data?.vendorID,
      selectedVendorCountry:data?.vendorDetails?.billingCountry,
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
      workDeliveryDateOrMonth: this.convertToNgbDate(
        data?.workDeliveryDateOrMonth
      ),
      purchaseCurrency: data?.purchaseCurrency,

      //Tab 2
      invoiceFeeDetails: data?.feeDetails,
      discountAmt: data?.discountAmt ?? 0,
      discountCreditNoteAmt: data?.discountCreditNoteAmt ?? 0,

      // Tab 3
      paymentDate: this.convertToNgbDate(data?.paymentDate),
      bankID: data?.bankID,
      owrmNo1: data?.oWRMNo1,
      owrmNo2: data?.oWRMNo2,
      paymentCurrency: data?.paymentCurrency,
      paymentAmount: data?.paymentAmount,

      // Tab 4
      customerPONo: data?.customerPONo,
      poDate: this.convertToNgbDate(data?.pODate),
      poValueInclusiveTaxes: data?.pOValueInclusiveTaxes,
      saleCurrency: data?.saleCurrency,
      salesInvoiceDetails: data?.saleDetails,
      // Charges tab

      // Total is calculated, not patched
    });
    this.invoiceFeeDetails.clear();
    data.feeDetails?.forEach((fee: any) => {
      this.invoiceFeeDetails.push(
        this.fb.group({
          feeType: [fee.feeType],
          subFeeValue: [fee.subFeeValue],
          country: [fee.country],
          language: [fee.language],
          amount: [fee.amount],
          remarks: [fee.remarks],
        })
      );
    });

    this.salesInvoiceDetails.clear();
    data.saleDetails?.forEach((sale: any) => {
      this.salesInvoiceDetails.push(
        this.fb.group({
          type: [sale.type],
          invoiceNo: [sale.invoiceNo],
          amount: [sale.amount],
          estimateNo: [sale.estimateNo],
          remarks: [sale.remarks],
          postedInTally: [sale.postedInTally],
        })
      );
    });
    // Optional: Patch totals (only if you store them)
    this.addOrEditDispatchNoteFormGroup.patchValue({
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
      status: filters?.status || '',
    };
    this.vendorService.getVendors(data, offset, count).subscribe(
      (response: any) => {
        console.log(response);
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

  private async getAllcountyListInit() {
    var data = {};
    this.countryService.getCountryData(data).subscribe(
      (response: any) => {
        this.countryList = response.countrys;
        console.log(this.countryList);
        this.loadSpinner = false;
      },
      () => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  getAllTransactionTypes(
    offset: number = 0,
    count: number = 0,
    filters: any = ''
  ) {
    let data = {
      bankCode: filters?.transactionTypeCode || '',
      bankName: filters?.transactionTypeName || '',
      status: filters?.status || '',
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
      this.addOrEditDispatchNoteFormGroup.get('invoiceDate')?.value;
    const creditDays = this.addOrEditDispatchNoteFormGroup.get(
      'creditDaysAsPerContract'
    )?.value;

    if (invoiceDateStruct && creditDays != null && !isNaN(creditDays)) {
      const invoiceDate = new Date(
        invoiceDateStruct.year,
        invoiceDateStruct.month - 1,
        invoiceDateStruct.day
      );

      invoiceDate.setDate(invoiceDate.getDate() + Number(creditDays));

      // Local time formatting (avoid UTC offset issues)
      const yyyy = invoiceDate.getFullYear();
      const mm = String(invoiceDate.getMonth() + 1).padStart(2, '0');
      const dd = String(invoiceDate.getDate()).padStart(2, '0');
      const dueDate = `${yyyy}-${mm}-${dd}`;

      this.addOrEditDispatchNoteFormGroup
        .get('dueDateAsPerContract')
        ?.setValue(dueDate);
    } else {
      this.addOrEditDispatchNoteFormGroup
        .get('dueDateAsPerContract')
        ?.setValue('');
    }
  }

  onInvoiceDateChange(event: any) {
    this.calculateDueDate();
  }

  onCreditDaysChange() {
    this.calculateDueDate();
  }

  onCancelPress() {
    this.router.navigate(['transaction/VendorInvoiceTxn']);
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
      saleProfessionalInvoices: [],
      saleGovtInvoices: [],
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

  async onSavePress() {
    this.loadSpinner = true;

    // Build invoice object from form values
    const invoiceData: any = {
      //tab 1
      vendorId:
        this.addOrEditDispatchNoteFormGroup.controls['vendorId'].value || null,
      invoiceDate: this.formatDate(
        this.addOrEditDispatchNoteFormGroup.controls['invoiceDate'].value
      ),
      fy: this.addOrEditDispatchNoteFormGroup.controls['fy'].value,
      clientInvoiceNo:
        this.addOrEditDispatchNoteFormGroup.controls['clientInvoiceNo'].value,
      dueDateAsPerInvoice: this.formatDate(
        this.addOrEditDispatchNoteFormGroup.controls['dueDateAsPerInvoice']
          .value
      ),

      creditDaysAsPerContract: Number(
        this.addOrEditDispatchNoteFormGroup.controls['creditDaysAsPerContract']
          .value
      ),
      // dueDateAsPerContract: this.formatDate(
      //   this.addOrEditDispatchNoteFormGroup.controls['dueDateAsPerContract']
      //     .value
      // ),
      customerId: Number(
        this.addOrEditDispatchNoteFormGroup.controls['customerId'].value || null
      ),
      description:
        this.addOrEditDispatchNoteFormGroup.controls['description'].value,
      title: this.addOrEditDispatchNoteFormGroup.controls['title'].value,
      applicationNumber:
        this.addOrEditDispatchNoteFormGroup.controls['applicationNumber'].value,
      filingDate: this.formatDate(
        this.addOrEditDispatchNoteFormGroup.controls['filingDate'].value
      ),
      clientRefNo:
        this.addOrEditDispatchNoteFormGroup.controls['clientRefNo'].value,
      ourRefNo: this.addOrEditDispatchNoteFormGroup.controls['ourRefNo'].value,
      officialFilingReceiptSupporting:
        this.addOrEditDispatchNoteFormGroup.controls[
          'officialFilingReceiptSupporting'
        ].value,
      workDeliveryDateOrMonth: this.formatDate(
        this.addOrEditDispatchNoteFormGroup.controls['workDeliveryDateOrMonth']
          .value
      ),
      purchaseCurrency:
        this.addOrEditDispatchNoteFormGroup.controls['purchaseCurrency'].value,

      //tab2
      invoiceFeeDetails:
        this.addOrEditDispatchNoteFormGroup.get('invoiceFeeDetails')?.value ||
        [],

      professionalFeeAmt: Number(
        this.addOrEditDispatchNoteFormGroup.controls['professionalFeeAmt']
          ?.value
      ),
      govtOrOfficialFeeAmt: Number(
        this.addOrEditDispatchNoteFormGroup.controls['govtOrOfficialFeeAmt']
          ?.value
      ),
      otherChargesAmt: Number(
        this.addOrEditDispatchNoteFormGroup.controls['otherChargesAmt']?.value
      ),
      discountAmt: Number(
        this.addOrEditDispatchNoteFormGroup.controls['discountAmt']?.value
      ),
      discountCreditNoteAmt: Number(
        this.addOrEditDispatchNoteFormGroup.controls['discountCreditNoteAmt']
          ?.value
      ),
      totalAmount: Number(
        this.addOrEditDispatchNoteFormGroup.controls['totalAmount']?.value
      ),

      // tab3
      paymentDate: this.formatDate(
        this.addOrEditDispatchNoteFormGroup.controls['paymentDate'].value
      ),
      
      bankID: this.addOrEditDispatchNoteFormGroup.controls['bankID'].value || null,
      owrmNo1: this.addOrEditDispatchNoteFormGroup.controls['owrmNo1'].value,
      owrmNo2: this.addOrEditDispatchNoteFormGroup.controls['owrmNo2'].value,
      paymentCurrency:
        this.addOrEditDispatchNoteFormGroup.controls['paymentCurrency'].value,
      paymentAmount: Number(
        this.addOrEditDispatchNoteFormGroup.controls['paymentAmount'].value
      ),

      // tab4
      customerPONo:
        this.addOrEditDispatchNoteFormGroup.controls['customerPONo'].value,
      poDate: this.formatDate(
        this.addOrEditDispatchNoteFormGroup.controls['poDate'].value
      ),
      poValueInclusiveTaxes: Number(
        this.addOrEditDispatchNoteFormGroup.controls['poValueInclusiveTaxes']
          .value
      ),

      saleCurrency:
        this.addOrEditDispatchNoteFormGroup.controls['saleCurrency'].value,

      // saleProfessionalInvoiceDetails:
      //   this.addOrEditDispatchNoteFormGroup.get('saleProfessionalInvoices')
      //     ?.value || [],

      // govtSaleInvoiceDetails:
      //   this.addOrEditDispatchNoteFormGroup.get('saleGovtInvoices')?.value ||
      //   [],

      salesInvoiceDetails:
        this.addOrEditDispatchNoteFormGroup.get('salesInvoiceDetails')?.value ||
        [],

      createdBy: '', // Add dynamically if required
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
            this.router.navigate(['transaction/VendorInvoiceTxn']);
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
          this.router.navigate(['transaction/VendorInvoiceTxn']);
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
    // return !this.addOrEditDispatchNoteFormGroup.controls['locationId']?.value
    // || !this.addOrEditDispatchNoteFormGroup.controls['supplierCode']?.value ||
    // !this.addOrEditDispatchNoteFormGroup.controls['transporterCode']?.value ||
    // !this.addOrEditDispatchNoteFormGroup.controls['transporterMode']?.value ||
    // !this.addOrEditDispatchNoteFormGroup.controls['vehicleNumber']?.value
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
    // this.frlrDate = e.year + '-' + month.toString() + '-' + day.toString();
  }

  // Create Row
  createInvoiceFeeDetailsGroup() {
    const detail = this.fb.group({
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

  get invoiceFeeDetails(): FormArray {
    return this.addOrEditDispatchNoteFormGroup.get(
      'invoiceFeeDetails'
    ) as FormArray;
  }

  get salesInvoiceDetails(): FormArray {
    return this.addOrEditDispatchNoteFormGroup.get(
      'salesInvoiceDetails'
    ) as FormArray;
  }

  createInvoiceGroup(type: string): FormGroup {
    return this.fb.group({
      type: [type],
      invoiceNo: [''],
      amount: [''],
      estimateNo: [''],
      remarks: [''],
      postedInTally: [''],
    });
  }
  addSaleInvoice(type: string) {
    const group = this.fb.group({
      type: [type], // 'Professional' or 'Govt'
      invoiceNo: [''],
      amount: [''],
      estimateNo: [''],
      remarks: [''],
      postedInTally: [''],
    });

    this.salesInvoiceDetails.push(group);
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

    this.addOrEditDispatchNoteFormGroup
      .get('professionalFeeAmt')
      ?.patchValue(professionalFeeTotal.toFixed(2)); // Format to 2 decimal places
    this.addOrEditDispatchNoteFormGroup
      .get('govtOrOfficialFeeAmt')
      ?.patchValue(govtOrOfficialFeeTotal.toFixed(2));
    this.addOrEditDispatchNoteFormGroup
      .get('otherChargesAmt')
      ?.patchValue(otherChargesTotal.toFixed(2));
    const discountAmt =
      parseFloat(
        this.addOrEditDispatchNoteFormGroup.get('discountAmt')?.value
      ) || 0;
    const discountCreditNoteAmt =
      parseFloat(
        this.addOrEditDispatchNoteFormGroup.get('discountCreditNoteAmt')?.value
      ) || 0;

    const totalCalculatedAmount =
      professionalFeeTotal +
      govtOrOfficialFeeTotal +
      otherChargesTotal -
      discountAmt -
      discountCreditNoteAmt;

    this.addOrEditDispatchNoteFormGroup
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
        typeof filters === 'object' ? filters.lookUpType || '' : filters || '', // if filters is string, it's lookUpType
      value: typeof filters === 'object' ? filters.value || '' : '',
      status: typeof filters === 'object' ? filters.status || '' : '',
    };
    this.loadSpinner = true;
    this.lookupService.getLookupsType(data).subscribe(
      (response: any) => {
        const lookups = response.lookUps || [];

        if (rowIndex !== undefined && rowControl) {
          // Called from FeeType selection
          this.subFeeOptionsList[rowIndex] = lookups;
          rowControl.get('subFeeValue')?.setValue(''); // Clear old value
          this.loadSpinner = false;
        } else {
          // Called from general lookup fetch
          this.loadSpinner = false;
        }

        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }
}
