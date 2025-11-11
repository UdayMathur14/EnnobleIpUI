import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbDate, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BiltiService } from '../../../../../core/service/bilti.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  paymentForm!: FormGroup;
  transactionTypesList: any = [];
  currencyList: any = [];
  selectedInvoiceIds: number[] = [];
  @Output() paymentSuccess = new EventEmitter<void>();

  paymentTypes = [
    { name: 'Full Payment', value: 'full' },
    { name: 'Partial Payment', value: 'partial' },
  ];

  @ViewChild('paymentModal') paymentModal: any;
  validationError: string = '';
  disableSubmit: boolean = false;

  // 🔥 FIX: Property to store the active modal reference
  activeModal: NgbModalRef | null = null;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private biltiService: BiltiService,
    private toastr: ToastrService,
    private lookupService: LookupService,
    private transactionType: TransactionTypesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getPaymentCurrencyList();
    this.getAllTransactionTypes();
    this.initializeForm();

    this.paymentForm.get('paymentType')?.valueChanges.subscribe(() => {
      this.onPaymentTypeChange();
    });

    // Listen to changes in the rate/charges controls to recalculate validation
    this.paymentForm
      .get('rate')
      ?.valueChanges.subscribe(() => this.calculateAmounts());
    this.paymentForm
      .get('bankCharges')
      ?.valueChanges.subscribe(() => this.calculateAmounts());
  }

  initializeForm(): void {
    this.paymentForm = this.fb.group({
      paymentType: ['full', [Validators.required]],
      paymentDate: ['', [Validators.required]],
      bankID: ['', [Validators.required]],
      owrmNo1: ['', [Validators.required]],
      rate: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      paymentCurrency: [null, Validators.required],
      bankCharges: [0, [Validators.required, Validators.min(0)]],
    });
  }

  get selectedInvoicesTotal(): number {
    if (!this.biltisList) return 0;

    // Sums up the RemainingBalance for all selected invoices
    return this.biltisList
      .filter((x: { isSelected: any }) => x.isSelected)
      .reduce(
        (sum: number, x: any) => sum + (parseFloat(x.remainingBalance) || 0),
        0
      );
  }

  onPaymentTypeChange() {
    const type = this.paymentForm.get('paymentType')?.value;
    const rateControl = this.paymentForm.get('rate');
    const chargesControl = this.paymentForm.get('bankCharges');

    this.validationError = '';
    this.disableSubmit = true;
    this.resetInvoiceCalculations();

    if (type === 'full') {
      rateControl?.enable();
      chargesControl?.enable();

      rateControl?.setValidators([Validators.required, Validators.min(0.01)]);
      chargesControl?.setValidators([Validators.required, Validators.min(0)]);

      // 🔥 FIX: Set rate to the Total Remaining Balance
      rateControl?.patchValue(this.selectedInvoicesTotal);
      chargesControl?.patchValue(0);

      this.calculateAmounts();
    } else if (type === 'partial') {
      rateControl?.disable();
      chargesControl?.disable();

      rateControl?.clearValidators();
      chargesControl?.clearValidators();

      rateControl?.patchValue(0);
      chargesControl?.patchValue(0);
    }

    rateControl?.updateValueAndValidity();
    chargesControl?.updateValueAndValidity();
  }

  calculateForAllInvoices() {
    // When a checkbox changes, check the payment type to run the right calculation
    if (this.paymentForm.get('paymentType')?.value === 'full') {
      this.onPaymentTypeChange(); // This will reset and calculate based on new selection total
    } else {
      // For partial payment, reset individual invoice values on selection change
      this.biltisList.forEach((invoice: any) => {
        if (invoice.isSelected) {
          invoice.partialAmount = invoice.partialAmount || 0;
          invoice.partialBankCharges = invoice.partialBankCharges || 0;
          this.calculatePartialAmounts(invoice);
        } else {
          this.clearInvoiceCalculations(invoice);
        }
      });
    }
  }

  clearInvoiceCalculations(invoice: any) {
    invoice.calculatedTotalINR = 0;
    invoice.calculatedBankCharges = 0;
    invoice.partialAmount = 0;
    invoice.partialBankCharges = 0;
  }

  // Function for calculating amounts in Partial Payment mode
 // bilti-grid-table.component.ts

calculatePartialAmounts(invoice: any) {
    // Original input strings fetch
    const rawBankChargesInput = invoice.partialBankCharges;
    const rawRateOfExchangeInput = this.paymentForm.get('quantity')?.value;

    const partialAmount = parseFloat(invoice.partialAmount) || 0;
    const partialBankCharges = parseFloat(rawBankChargesInput) || 0; 

    // Rate of Exchange ko parse karo. Agar yeh bhi khali hai, toh NaN aayega.
    const rateOfExchange = parseFloat(rawRateOfExchangeInput) || 0; 

    // 1. Validation State Reset
    this.validationError = '';
    this.disableSubmit = false;

    // --- CRITICAL INDIVIDUAL CHECKS ---

    // 2. Bank Charges Blank/Invalid Check
    // Button disable hoga agar input khaali hai ('') ya negative hai.
    if (rawBankChargesInput === '' || rawBankChargesInput === null || rawBankChargesInput === undefined || partialBankCharges < 0) {
        this.validationError = `Bank Charges for Invoice ${invoice.clientInvoiceNo} cannot be blank or negative. Enter 0 if applicable.`;
        this.disableSubmit = true; 
        invoice.calculatedTotalINR = 0;
        invoice.calculatedBankCharges = 0;
        return; 
    }

    // 3. Amount Exceeds Remaining Balance Check
    if (partialAmount > invoice.remainingBalance) {
        this.validationError = `Payment amount for Invoice ${invoice.clientInvoiceNo} cannot exceed ${invoice.remainingBalance.toFixed(2)}.`;
        this.disableSubmit = true;
        invoice.calculatedTotalINR = 0;
        invoice.calculatedBankCharges = 0;
        return; 
    }

    // --- Calculation ---
    invoice.calculatedBankCharges = partialBankCharges;
    invoice.calculatedTotalINR = partialAmount * rateOfExchange + partialBankCharges;

    // --- GLOBAL CHECKS ---

    // 4. Rate of Exchange Invalid Check: RoE is a required field in master form
    if (rateOfExchange <= 0 || isNaN(rateOfExchange)) {
        this.validationError = 'Rate Of Exchange must be entered and greater than zero.';
        this.disableSubmit = true;
    }
    
    // 5. Zero Payment Check (Only runs if rateOfExchange is valid, otherwise 4 handles it)
    else if (this.biltisList.filter((inv: any) => inv.isSelected).some((inv: any) => (parseFloat(inv.partialAmount) || 0) <= 0)) {
        this.validationError = 'All selected invoices must have a payment amount greater than zero.';
        this.disableSubmit = true;
    }
    
    // 6. Master Form Validity Check (The final safety net)
    // Yeh check ensure karega ki agar invoice amounts sahi hain, tab bhi Date, Bank, OWRM No ke khali hone par button disabled rahe.
    if (!this.disableSubmit && this.paymentForm.invalid) {
         // Is case mein hum validation error set nahi karte, kyuki form.invalid khud fields ke paas error dikhayega.
         this.disableSubmit = true;
    }
}

  openPaymentModal() {
    this.selectedInvoiceIds = this.biltisList
      .filter((x: any) => x.isSelected)
      .map((x: any) => x.id);

    if (!this.selectedInvoiceIds.length) {
      this.toastr.error('Please select at least one invoice.');
      return;
    }

    const firstSelectedInvoice = this.biltisList.find((x: any) => x.isSelected);
    const vendorCurrency =
      firstSelectedInvoice?.vendorDetails?.currency || null;

    this.paymentForm.reset();

    this.paymentForm.patchValue({
      paymentType: 'full',
      quantity: 1,
      paymentCurrency: vendorCurrency,
    });

    this.onPaymentTypeChange(); // Sets up rate/bankCharges/validators/initial rate value

    this.paymentForm.get('paymentCurrency')?.disable();

    this.resetInvoiceCalculations();
    this.calculateAmounts();

    // 🔥 FIX: Store the modal reference in the new property
    this.activeModal = this.modalService.open(this.paymentModal, {
      size: 'xl',
      backdrop: 'static',
    });
  }

  calculateAmounts() {
    const formValue = this.paymentForm.value;
    const paymentType = formValue.paymentType;

    if (paymentType === 'partial') {
      return;
    }

    let forexAmount = parseFloat(formValue.rate) || 0;
    const rateOfExchange = parseFloat(formValue.quantity) || 0;
    const totalBankCharges = parseFloat(formValue.bankCharges) || 0;
    const totalRemainingBalance = this.selectedInvoicesTotal;

    this.validationError = '';

    // **FULL PAYMENT Validation**
    // 🔥 FIX: Use Math.abs() for safe floating-point comparison (0.001 epsilon)
    const isForexAmountValid =
      Math.abs(forexAmount - totalRemainingBalance) < 0.001;

    if (!isForexAmountValid) {
      this.validationError = `Forex Amount (${forexAmount.toFixed(
        2
      )}) must be equal to Total Selected Remaining Amount (${totalRemainingBalance.toFixed(
        2
      )}).`;
      this.disableSubmit = true;
      this.resetInvoiceCalculations(true);
      return;
    }

    this.disableSubmit = false;

    this.biltisList.forEach((invoice: any) => {
      if (invoice.isSelected) {
        const invRemainingBalance = parseFloat(invoice.remainingBalance) || 0;

        // Base the proportion on the REMAINING Balance
        const proportion =
          totalRemainingBalance > 0
            ? invRemainingBalance / totalRemainingBalance
            : 0;

        const distributedBankCharge = totalBankCharges * proportion;

        // Calculate Total INR using the REMAINING Balance as the base amount
        const totalAmountInr =
          invRemainingBalance * rateOfExchange + distributedBankCharge;

        invoice.calculatedBankCharges = distributedBankCharge;
        invoice.calculatedTotalINR = totalAmountInr;
      } else {
        invoice.calculatedBankCharges = 0;
        invoice.calculatedTotalINR = 0;
      }
    });
  }

  submitPayment() {
    if (this.disableSubmit) {
      this.toastr.error(
        this.validationError ||
          'There are validation errors. Please check your amounts.'
      );
      return;
    }

    const payload = this.prepareFinalPaymentPayload();

    if (!payload.PaymentDetails || payload.PaymentDetails.length === 0) {
      this.toastr.error('No selected invoices to process.');
      return;
    }

    this.sendPaymentPayload(payload);
  }

  sendPaymentPayload(payload: any) {
    this.loadSpinner = true;
    this.biltiService.createBilti(payload).subscribe(
      () => {
        this.loadSpinner = false;
        this.toastr.success('Payment added successfully!');
        this.paymentForm.reset();
        this.paymentSuccess.emit();

        // 🔥 FIX: Close modal on success
        if (this.activeModal) {
          this.activeModal.close('submit success');
          this.activeModal = null; // Clear reference
        }
      },
      (error: any) => {
        this.loadSpinner = false;
        console.error('Error while adding payment:', error);
        this.toastr.error('Failed to add payment.');

        // 🔥 FIX: Close modal on failure (Good UX)
        if (this.activeModal) {
          this.activeModal.close('submit failed');
          this.activeModal = null; // Clear reference
        }
      }
    );
  }

  resetInvoiceCalculations(onlyCalculated = false) {
    this.biltisList.forEach((invoice: any) => {
      invoice.calculatedBankCharges = 0;
      invoice.calculatedTotalINR = 0;
      if (!onlyCalculated) {
        invoice.partialAmount = 0;
        invoice.partialBankCharges = 0;
      }
    });
  }

  prepareFinalPaymentPayload(): any {
    const finalPaymentDetails: any[] = [];
    const masterDetails = this.paymentForm.value;
    const paymentType = masterDetails.paymentType;

    const totalMasterBankCharges = parseFloat(masterDetails.bankCharges) || 0;
    const totalRemaining = this.selectedInvoicesTotal;
    const rateOfExchange = parseFloat(masterDetails.quantity) || 0;

    this.biltisList
      .filter((invoice: any) => invoice.isSelected)
      .forEach((invoice: any) => {
        let forexPaidAmount: number = 0;
        let finalBankCharges: number = 0;
        const invRemainingBalance = parseFloat(invoice.remainingBalance) || 0;

        if (paymentType === 'partial') {
          forexPaidAmount = parseFloat(invoice.partialAmount) || 0;
          finalBankCharges = parseFloat(invoice.partialBankCharges) || 0;
        } else {
          // SCENARIO: FULL PAYMENT
          forexPaidAmount = invRemainingBalance; // 🔥 Use Remaining Balance (e.g., 70.00)

          // Calculate proportional distribution
          const proportion =
            totalRemaining > 0 ? invRemainingBalance / totalRemaining : 0;
          finalBankCharges = totalMasterBankCharges * proportion;
        }

        // Construct the final payload item
        finalPaymentDetails.push({
          VendorInvoiceId: invoice.id,
          paymentDate: this.convertNgbToDate(masterDetails.paymentDate),
          bankID: masterDetails.bankID,
          paymentCurrency: this.paymentForm.get('paymentCurrency')?.value, // Use disabled control value
          oWRMNo1: masterDetails.owrmNo1,

          // These fields hold the final calculated/entered amount per invoice:
          rate: forexPaidAmount, // Forex Paid (Remaining or Partial)
          bankcharges: finalBankCharges, // Distributed or Individual Charges
          quantity: rateOfExchange, // ROE
          isPartial: paymentType === 'partial',
        });
      });

    return {
      PaymentDetails: finalPaymentDetails, // <-- The single, unified list
    };
  }

  // --- Standard Helper Methods ---
  // (getPaymentCurrencyList, getAllTransactionTypes, convertNgbToDate, validateDecimal, trackByFn remain the same)
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
    const data = {
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
  convertNgbToDate(date: NgbDate) {
    if (!date) return null;
    const month = Number(date.month) < 10 ? '0' + date.month : date.month;
    const day = Number(date.day) < 10 ? '0' + date.day : date.day;
    return date.year + '-' + month.toString() + '-' + day.toString();
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
  trackByFn(index: number, item: any) {
    return item.id || index;
  }
}
