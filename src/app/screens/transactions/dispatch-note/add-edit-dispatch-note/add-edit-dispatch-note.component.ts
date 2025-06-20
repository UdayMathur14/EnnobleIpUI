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
import { TransporterService } from '../../../../core/service/transporter.service';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CountryService } from '../../../../core/service/country.service';
import { TransactionTypesService } from '../../../../core/service/transactionTypes.service';

@Component({
  selector: 'app-add-edit-dispatch-note',
  templateUrl: './add-edit-dispatch-note.component.html',
  styleUrl: './add-edit-dispatch-note.component.scss',
})
export class AddEditDispatchNoteComponent {
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
  partDetailsList: any[] = [];
  salesDetailsList: any[] = [];

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

    this.partDetails.valueChanges.subscribe(() => {
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
      fillingDate: [''],
      clientRefNo: [''], // Maps to [ClientRefNo]
      ourRefNo: [''], // Maps to [OurRefNo]
      officialFilingReceiptSupporting: [''], // Maps to [OfficialFilingReceiptSupporting]
      workDeliveryDateOrMonth: [''], // Maps to [WorkDeliveryDateOrMonth]
      currencyPID: [''], // Maps to [CurrencyPID]
      //professionalFeeAmt: [''], // Maps to [ProfessionalFeeAmt]
      // govtOrOfficialFeeAmt: [''], // Maps to [GovtOrOfficialFeeAmt]
      // otherChargesAmt: [''], // Maps to [OtherChargesAmt]
      // discountAmt: [''], // Maps to [DiscountAmt]
      // discountCreditNoteAmt: [''],
      // TotalAmt: [''], // Maps to [DiscountCreditNoteAmt]

      //tab2

      paymentDate: [''], // Maps to [PaymentDate]
      bankID: [''], // Maps to [BankID]
      owrmNo1: [''], // Maps to [OWRMNo]
      owrmNo2: [''],
      currency2: [''],
      paymentAmount: [''], // Maps to [CustomerPONo]

      //tab4
      // customerPONo: [''],
      // poDate: [''], // Maps to [PODate]
      // poValueInclusiveTaxes: [''],
      // currency3: [''],
      // professionalFeeInvoiceNo: [''],
      // professionalFeeInvoiceAmount: [''],
      // govtFeesInvoiceNo: [''], // Maps to [POValueInclusiveTaxes]
      // govtFeesInvoiceAmount:[''],
      // officialFeeInvoiceAmount:[''],
      // ourInvoiceNo: [''], // Maps to [OurInvoiceNo]
      // invoiceAmount: [''], //  
      // estimateNoProfFee: [''], // Maps to [EstimateNoProfFee]
      // estimateNoGovtFee: [''], // Maps to [EstimateNoGovtFee]
      // remarks: [''], // Maps to [Remarks]
      // postedInTally: [''], // Maps to [PostedInTally]
      status: [''],

      partdetails: this.fb.array([]),
      salesdetails: this.fb.array([]),
      professionalFeeAmt: [{ value: 0, disabled: true }], // Initialize with 0 and disable
      govtOrOfficialFeeAmt: [{ value: 0, disabled: true }], // Initialize with 0 and disable
      otherChargesAmt: [{ value: 0, disabled: true }],

      discountAmt: [0, [Validators.required]], // Initialize with 0, user enters
      discountCreditNoteAmt: [0, [Validators.required]], // Initialize with 0, user enters
      TotalAmt: [{ value: 0, disabled: true }],
    });

    this.partDetails.valueChanges.subscribe(() => {
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
    } else {
      this.selectedVendorCountry = '';
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
      vendorId: data?.vendorId,
      invoiceDate: data?.invoiceDate,
      fy: data?.fy,
      clientInvoiceNo: data?.clientInvoiceNo,
      dueDateAsPerInvoice: data?.dueDateAsPerInvoice,
      creditDaysAsPerContract: data?.creditDaysAsPerContract,
      dueDateAsPerContract: data?.dueDateAsPerContract,
      customerId: data?.customerId,
      description: data?.description,
      title: data?.title,
      applicationNumber: data?.applicationNumber,
      fillingDate: data?.fillingDate,
      clientRefNo: data?.clientRefNo,
      ourRefNo: data?.ourRefNo,
      officialFilingReceiptSupporting: data?.officialFilingReceiptSupporting,
      workDeliveryDateOrMonth: data?.workDeliveryDateOrMonth,
      currencyPID: data?.currencyPID,

      // Tab 2
      paymentDate: data?.paymentDate,
      bankID: data?.bankID,
      owrmNo1: data?.owrmNo1,
      owrmNo2: data?.owrmNo2,
      currency2: data?.currency2,
      paymentAmount: data?.paymentAmount,

      // Tab 4
      customerPONo: data?.customerPONo,
      poDate: data?.poDate,
      poValueInclusiveTaxes: data?.poValueInclusiveTaxes,
      professionalFeeInvoiceNo: data?.professionalFeeInvoiceNo,
      currency3: data?.currency3,
      professionalFeeInvoiceAmount: data?.professionalFeeInvoiceAmount,
      govtFeesInvoiceNo: data?.govtFeesInvoiceNo,
      ourInvoiceNo: data?.ourInvoiceNo,
      invoiceAmount: data?.invoiceAmount,
      govtFeeInvoiceNo: data?.govtFeeInvoiceNo,
      officialFeeInvoiceAmount: data?.officialFeeInvoiceAmount,
      estimateNoProfFee: data?.estimateNoProfFee,
      estimateNoGovtFee: data?.estimateNoGovtFee,
      remarks: data?.remarks,
      postedInTally: data?.postedInTally,
      status: data?.status,

      // Charges tab
      discountAmt: data?.discountAmt ?? 0,
      discountCreditNoteAmt: data?.discountCreditNoteAmt ?? 0,

      // Total is calculated, not patched
    });

    // Optional: Patch totals (only if you store them)
    this.addOrEditDispatchNoteFormGroup.patchValue({
      professionalFeeAmt: data?.professionalFeeAmt ?? 0,
      govtOrOfficialFeeAmt: data?.govtOrOfficialFeeAmt ?? 0,
      otherChargesAmt: data?.otherChargesAmt ?? 0,
      TotalAmt: data?.TotalAmt ?? 0,
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
        this.toastr.error(
        );
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
      partDetails: [],
      salesDetails: [],
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
      vendorId:
        this.addOrEditDispatchNoteFormGroup.controls['vendorId'].value || 0,
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
      dueDateAsPerContract: this.formatDate(
        this.addOrEditDispatchNoteFormGroup.controls['dueDateAsPerContract']
          .value
      ),
      customerId: Number(
        this.addOrEditDispatchNoteFormGroup.controls['customerId'].value
      ),
      description:
        this.addOrEditDispatchNoteFormGroup.controls['description'].value,
      title: this.addOrEditDispatchNoteFormGroup.controls['title'].value,
      applicationNumber:
        this.addOrEditDispatchNoteFormGroup.controls['applicationNumber'].value,
      fillingDate: this.formatDate(
        this.addOrEditDispatchNoteFormGroup.controls['fillingDate'].value
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
      currencyPID:
        this.addOrEditDispatchNoteFormGroup.controls['currencyPID'].value,
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
      totalAmt: Number(
        this.addOrEditDispatchNoteFormGroup.controls['TotalAmt']?.value
      ),

      // tab2
      paymentDate: this.formatDate(
        this.addOrEditDispatchNoteFormGroup.controls['paymentDate'].value
      ),

      bankID: this.addOrEditDispatchNoteFormGroup.controls['bankID'].value,
      owrmNo1: this.addOrEditDispatchNoteFormGroup.controls['owrmNo1'].value,
      owrmNo2: this.addOrEditDispatchNoteFormGroup.controls['owrmNo2'].value,
      currency2:
        this.addOrEditDispatchNoteFormGroup.controls['currency2'].value,
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
      professionalFeeInvoiceNo:
        this.addOrEditDispatchNoteFormGroup.controls['professionalFeeInvoiceNo']
          .value,
      currency3:
        this.addOrEditDispatchNoteFormGroup.controls['currency3'].value,
      professionalFeeInvoiceAmount: Number(
        this.addOrEditDispatchNoteFormGroup.controls[
          'professionalFeeInvoiceAmount'
        ].value
      ),
      govtFeesInvoiceNo:
        this.addOrEditDispatchNoteFormGroup.controls['govtFeesInvoiceNo'].value,
      ourInvoiceNo:
        this.addOrEditDispatchNoteFormGroup.controls['ourInvoiceNo'].value,
      invoiceAmount: Number(
        this.addOrEditDispatchNoteFormGroup.controls['invoiceAmount'].value
      ),
      govtFeeInvoiceNo:
        this.addOrEditDispatchNoteFormGroup.controls['govtFeeInvoiceNo'].value,
      officialFeeInvoiceAmount: Number(
        this.addOrEditDispatchNoteFormGroup.controls['officialFeeInvoiceAmount']
          .value
      ),
      estimateNoProfFee: Number(
        this.addOrEditDispatchNoteFormGroup.controls['estimateNoProfFee'].value
      ),
      estimateNoGovtFee: Number(
        this.addOrEditDispatchNoteFormGroup.controls['estimateNoGovtFee'].value
      ),
      remarks: this.addOrEditDispatchNoteFormGroup.controls['remarks'].value,
      postedInTally:
        this.addOrEditDispatchNoteFormGroup.controls['postedInTally'].value,
      status: this.addOrEditDispatchNoteFormGroup.controls['status'].value,
      feeDetails:
        this.addOrEditDispatchNoteFormGroup.get('partdetails')?.value || [],
      SalesDetails:
        this.addOrEditDispatchNoteFormGroup.get('salesdetails')?.value || [],
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

  createSalesDetailsGroup() {
    const detail1 = this.fb.group({
      
       customerPONo: [''],
       poDate: [''], // Maps to [PODate]
       poValueInclusiveTaxes: [''],
       currency3: [''],
       professionalFeeInvoiceNo: [''],
       professionalFeeInvoiceAmount: [''],
       govtFeesInvoiceNo: [''], // Maps to [POValueInclusiveTaxes]
       govtFeesInvoiceAmount:[''],
       officialFeeInvoiceAmount:[''],
       ourInvoiceNo: [''], // Maps to [OurInvoiceNo]
       invoiceAmount: [''], //  
       estimateNoProfFee: [''], // Maps to [EstimateNoProfFee]
       estimateNoGovtFee: [''], // Maps to [EstimateNoGovtFee]
       remarks: [''], // Maps to [Remarks]
       postedInTally: [''], // Maps to [PostedInTally]
    });

    this.salesDetails.push(detail1);
  }
  // Create Row
  createPartDetailsGroup() {
    const detail = this.fb.group({
      feeType: [''],
      subFeeValue: ['', [Validators.required]],
      country: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      remarks: [''],
      language: [''],
    });

    this.partDetails.push(detail);
    detail.get('feeType')?.valueChanges.subscribe(() => this.calculateTotals());
    detail.get('amount')?.valueChanges.subscribe(() => this.calculateTotals());

    this.calculateTotals();
  }

  get partDetails(): FormArray {
    return this.addOrEditDispatchNoteFormGroup.get('partdetails') as FormArray;
  }

  get salesDetails(): FormArray {
    return this.addOrEditDispatchNoteFormGroup.get('salesdetails') as FormArray;
  }

  // Delete Row
  onDeletePartDetail(part: any, i: number) {
    this.loadSpinner = true;
    this.partDetails.removeAt(i);
    const partNumber = part.value.partNumber;
    const index = this.selectedParts.indexOf(partNumber);
    if (index > -1) {
      this.selectedParts.splice(index, 1);
    }
    this.subFeeOptionsList.splice(index, 1);
    this.calculateTotals();
    this.loadSpinner = false; // remove corresponding subFee list
  }

  onDeleteSalesDetail(part: any, i: number) {
    this.loadSpinner = true;
    this.salesDetails.removeAt(i);
    const partNumber = part.value.partNumber;
    const index = this.selectedParts.indexOf(partNumber);
    if (index > -1) {
      this.selectedParts.splice(index, 1);
    }
    this.subFeeOptionsList.splice(index, 1);
    this.loadSpinner = false; // remove corresponding subFee list
  }

  updateSelectedParts(selectedPartNumbers: string[]) {
    this.selectedParts = selectedPartNumbers;
  }

  updateSelectedSales(selectedPartNumbers: string[]) {
    this.selectedParts = selectedPartNumbers;
  }

  getSelectedValue(event: Event): string {
    const target = event.target as HTMLSelectElement | null;
    return target?.value || '';
  }

  // On FeeType Change
  onFeeTypeSelect(feeType: string, index: number) {
    this.loadSpinner = true;
    const row = this.partDetails.at(index);
    this.getAllLookupsList(0, feeType, index, row);
    this.loadSpinner = false; // pass just the string
  }

  // In your component class
  calculateTotals() {
    let professionalFeeTotal = 0;
    let govtOrOfficialFeeTotal = 0;
    let otherChargesTotal = 0;

    this.partDetails.controls.forEach((group: AbstractControl) => {
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
      .get('TotalAmt')
      ?.patchValue(totalCalculatedAmount.toFixed(2));
  }

  onFeeTypeChange(index: number) {
    const anyTranslationSelected = this.partDetails.controls.some(
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
