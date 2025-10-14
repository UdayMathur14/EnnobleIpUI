import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BiltiService } from '../../../../../core/service/bilti.service';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LookupService } from '../../../../../core/service/lookup.service';
import { TransactionTypesService } from '../../../../../core/service/transactionTypes.service';

@Component({
  selector: 'app-bilti-grid-table',
  templateUrl: './bilti-grid-table.component.html',
  styleUrl: './bilti-grid-table.component.scss',
})
export class BiltiGridTableComponent implements OnInit {
  @Input() biltisList: any = [];
  loadSpinner: boolean = false;
  paymentFreeDetails!: FormGroup;
  transactionTypesList: any = [];
  currencyList: any = [];
  private fb: FormBuilder = new FormBuilder();
  selectedInvoiceIds: number[] = []; // ✅ multiple invoices

  @ViewChild('paymentModal') paymentModal: any; // for opening modal popup

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private biltiService: BiltiService,
    private toastr: ToastrService,
    private lookupService: LookupService,
    private transactionType: TransactionTypesService
  ) {}

  ngOnInit(): void {
    this.getPaymentCurrencyList();
    this.getAllTransactionTypes();

    // ✅ initialize form
    this.paymentFreeDetails = this.fb.group({
      paymentFeeDetails: this.fb.array([]),
    });
  }

  // ----------------- FORM GROUP CREATION ------------------
  createPaymentFeeDetailsGroup() {
    const detail = this.fb.group({
      id: [0],
      paymentDate: ['', [Validators.required]],
      bankID: ['', [Validators.required]],
      owrmNo1: ['', [Validators.required]],
      owrmNo2: [''],
      rate: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      paymentCurrency: ['', [Validators.required]],
      paymentAmount: [0],
      bankCharges: [0, [Validators.required, Validators.min(0)]],
      totalAmountInr: [0],
    });

    this.paymentFeeDetails.push(detail);
    const newFormGroup = this.paymentFeeDetails.at(
      this.paymentFeeDetails.length - 1
    ) as FormGroup;
    this.setupSubscriptions(newFormGroup);
  }

  get paymentFeeDetails(): FormArray {
    return this.paymentFreeDetails.get('paymentFeeDetails') as FormArray;
  }

  private setupSubscriptions(group: FormGroup) {
    group
      .get('rate')!
      .valueChanges.subscribe(() => this.calculateRowValues(group));
    group
      .get('quantity')!
      .valueChanges.subscribe(() => this.calculateRowValues(group));
    group
      .get('bankCharges')!
      .valueChanges.subscribe(() => this.calculateRowValues(group));
  }

  private calculateRowValues(group: FormGroup) {
    const rate = parseFloat(group.get('rate')?.value) || 0;
    const quantity = parseFloat(group.get('quantity')?.value) || 0;
    const bankCharges = parseFloat(group.get('bankCharges')?.value) || 0;

    const paymentAmount = rate * quantity;
    group.get('paymentAmount')?.patchValue(paymentAmount, { emitEvent: false });

    const totalAmountInr = paymentAmount + bankCharges;
    group
      .get('totalAmountInr')
      ?.patchValue(totalAmountInr, { emitEvent: false });
  }

  // ----------------- UTILS ------------------
  validateDecimal(event: KeyboardEvent) {
    const pattern = /[0-9.]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) event.preventDefault();

    const current: string = (event.target as HTMLInputElement).value;
    if (inputChar === '.' && current.includes('.')) event.preventDefault();
  }

  onDateSelect(type: string, e: any) {
    const month = Number(e.month) < 10 ? '0' + e.month : e.month;
    const day = Number(e.day) < 10 ? '0' + e.day : e.day;
    console.log('Selected date:', `${e.year}-${month}-${day}`);
  }

  // ----------------- LOOKUPS ------------------
  getPaymentCurrencyList() {
    this.loadSpinner = true;
    this.lookupService
      .getDropdownData('Currency')
      .subscribe((response: any) => {
        this.currencyList = response.lookUps || [];
        this.loadSpinner = false;
      });
  }

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
        this.transactionTypesList = response.banks;
      },
      () => (this.loadSpinner = false)
    );
  }

  private isTotalMatchingForex(): boolean {
    if (this.paymentFeeDetails.length === 0) return false;

    const formValue = this.paymentFeeDetails.at(0).value;
    const forexAmount = parseFloat(formValue.rate) || 0; // assuming you enter total Forex here

    // selectedInvoicesTotal is already calculated in your getter
    return forexAmount === this.selectedInvoicesTotal;
  }

  // ----------------- PAYMENT FLOW ------------------

  /** Called when user clicks Submit Payment */
  openPaymentModal() {
    // collect selected invoice IDs
    this.selectedInvoiceIds = this.biltisList
      .filter((x: any) => x.isSelected)
      .map((x: any) => x.id);

    if (!this.selectedInvoiceIds.length) {
      this.toastr.error('Please select at least one invoice.');
      return;
    }

    // reset old form array
    this.paymentFeeDetails.clear();
    this.createPaymentFeeDetailsGroup(); // add fresh one

    this.modalService.open(this.paymentModal, {
      size: 'lg',
      backdrop: 'static',
    });
  }

  /** Final Submit */
  submitPayment() {
    if (!this.paymentFreeDetails || this.paymentFeeDetails.length === 0) {
      this.toastr.error('Please add at least one payment entry.');
      return;
    }

    if (this.paymentFreeDetails.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    if (!this.isTotalMatchingForex()) {
      this.toastr.error(
        'Forex Amount must equal the total of selected invoices.'
      );
      return;
    }

    const formValue = this.paymentFeeDetails.at(0).value;

    const payload = {
      VendorInvoiceIds: this.selectedInvoiceIds, // ✅ multiple invoices
      PaymentDetails: [
        {
          id: formValue.id || 0,
          paymentDate: this.convertNgbToDate(formValue.paymentDate),
          bankID: formValue.bankID,
          oWRMNo1: formValue.owrmNo1,
          oWRMNo2: formValue.owrmNo2,
          rate: formValue.rate,
          quantity: formValue.quantity,
          bankcharges: formValue.bankCharges,
          totalAmountInr: formValue.totalAmountInr,
          paymentCurrency: formValue.paymentCurrency,
          paymentAmount: formValue.paymentAmount,
        },
      ],
    };

    console.log('Payload to submit:', payload);

    this.loadSpinner = true;
    this.biltiService.createBilti(payload).subscribe(
      () => {
        this.loadSpinner = false;
        this.toastr.success('Payment added successfully!');
        this.paymentFreeDetails.reset();
        this.paymentFeeDetails.clear();
      },
      (error: any) => {
        this.loadSpinner = false;
        console.error('Error while adding payment:', error);
        this.toastr.error('Failed to add payment.');
      }
    );
  }
  get selectedInvoicesTotal(): number {
    if (!this.biltisList) return 0;

    return this.biltisList
      .filter((x: { isSelected: any }) => x.isSelected) // match your checkbox property
      .reduce(
        (sum: any, x: { totalAmount: any }) => sum + (x.totalAmount || 0),
        0
      );
  }

  convertNgbToDate(date: NgbDate) {
    const month = Number(date.month) < 10 ? '0' + date.month : date.month;
    const day = Number(date.day) < 10 ? '0' + date.day : date.day;
    return date.year + '-' + month.toString() + '-' + day.toString();
  }
}
