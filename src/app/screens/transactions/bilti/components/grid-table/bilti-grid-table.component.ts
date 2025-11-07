import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  // New property for Payment Type options
  paymentTypes = [
    { name: 'Full Payment', value: 'full' },
    { name: 'Partial Payment', value: 'partial' },
  ];

  @ViewChild('paymentModal') paymentModal: any;
  validationError: string = '';
  disableSubmit: boolean = false;

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
  }
  
  initializeForm(): void {
    this.paymentForm = this.fb.group({
      // NEW: Payment Type control
      paymentType: ['full', [Validators.required]],
      paymentDate: ['', [Validators.required]],
      bankID: ['', [Validators.required]],
      owrmNo1: ['', [Validators.required]],
      owrmNo2: [''],
      // Note: Validators for rate and bankCharges will be set/removed dynamically
      rate: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      paymentCurrency: ['', [Validators.required]],
      bankCharges: [0, [Validators.required, Validators.min(0)]],
    });

    // Subscriptions logic can be removed or simplified, 
    // as calculateAmounts() is more robustly tied to (input) in the HTML.
    // this.setupSubscriptions(this.paymentForm); 
  }

  // NEW: Logic to handle change in payment type
  onPaymentTypeChange() {
    const type = this.paymentForm.get('paymentType')?.value;
    const rateControl = this.paymentForm.get('rate');
    const chargesControl = this.paymentForm.get('bankCharges');
    
    // Clear previous invoice calculations
    this.resetInvoiceCalculations();

    if (type === 'full') {
      // Full Payment: Forex Amount = Total Invoice Amount
      rateControl?.enable();
      rateControl?.setValidators([Validators.required, Validators.min(0.01)]);
      chargesControl?.enable();
      chargesControl?.setValidators([Validators.required, Validators.min(0)]);
      rateControl?.patchValue(this.selectedInvoicesTotal);
      chargesControl?.patchValue(0);
      
      this.calculateAmounts(); // Run calculation for full payment
    } else if (type === 'partial') {
      // Partial Payment: Forex and Bank Charges are disabled/0 in the main form
      rateControl?.disable();
      rateControl?.clearValidators();
      rateControl?.patchValue(0);

      chargesControl?.disable();
      chargesControl?.clearValidators();
      chargesControl?.patchValue(0);

      this.validationError = ''; // Clear validation error
      this.disableSubmit = false; // Enable submit button (validation handled per invoice)
    }

    rateControl?.updateValueAndValidity();
    chargesControl?.updateValueAndValidity();
  }

  // Modified to use the new calculated properties
  calculateForAllInvoices() {
    // When a checkbox changes, check the payment type to run the right calculation
    if (this.paymentForm.get('paymentType')?.value === 'full') {
      this.calculateAmounts();
    } else {
      // For partial payment, reset individual invoice values on selection change
      this.biltisList.forEach((invoice: any) => {
        if (invoice.isSelected) {
          // Initialize partial payment fields when selected
          invoice.partialAmount = invoice.partialAmount || 0;
          invoice.partialBankCharges = invoice.partialBankCharges || 0;
          this.calculatePartialAmounts(invoice);
        } else {
          // Clear calculations if deselected
          invoice.calculatedTotalINR = 0;
          invoice.calculatedBankCharges = 0;
          invoice.partialAmount = 0;
          invoice.partialBankCharges = 0;
        }
      });
    }
  }

  // NEW: Function for calculating amounts in Partial Payment mode
  calculatePartialAmounts(invoice: any) {
    const rateOfExchange = parseFloat(this.paymentForm.get('quantity')?.value) || 0;
    
    const partialAmount = parseFloat(invoice.partialAmount) || 0;
    const partialBankCharges = parseFloat(invoice.partialBankCharges) || 0;
    
    // Individual invoice amount validation
    if (partialAmount > invoice.totalAmount) {
      this.validationError = `Payment amount for Invoice ${invoice.clientInvoiceNo} cannot exceed ${invoice.totalAmount}.`;
      this.disableSubmit = true;
      invoice.calculatedTotalINR = 0;
      invoice.calculatedBankCharges = 0;
      return;
    }
    
    // Perform calculation for this specific invoice
    invoice.calculatedBankCharges = partialBankCharges; // In partial mode, user input is the distributed charge
    invoice.calculatedTotalINR = partialAmount * rateOfExchange + partialBankCharges;
    
    // Clear validation error if all individual amounts are valid
    this.validationError = ''; 
    this.disableSubmit = false;
    
    // Perform a final check to ensure all selected invoices have a payment amount > 0
    const hasZeroPayment = this.biltisList
      .filter((inv: any) => inv.isSelected)
      .some((inv: any) => (parseFloat(inv.partialAmount) || 0) <= 0);
      
    if (hasZeroPayment) {
        this.validationError = 'All selected invoices must have a payment amount greater than zero.';
        this.disableSubmit = true;
    }
  }

  // Renamed to perform Full Payment calculation only (or general form input)
  calculateAmounts() {
    const formValue = this.paymentForm.value;
    const paymentType = formValue.paymentType;
    
    if (paymentType === 'partial') {
        // Calculations for Partial are handled by calculatePartialAmounts()
        return; 
    }
    
    // Logic for FULL PAYMENT only
    const forexAmount = parseFloat(formValue.rate) || 0; 
    const rateOfExchange = parseFloat(formValue.quantity) || 0;
    const totalBankCharges = parseFloat(formValue.bankCharges) || 0;

    const totalInvoiceAmount = this.selectedInvoicesTotal;
    
    this.validationError = '';
    
    // **FULL PAYMENT Validation**
    // Using toFixed(2) to safely compare floating point numbers for currency
    if (forexAmount.toFixed(2) !== totalInvoiceAmount.toFixed(2)) {
      this.validationError = `Forex Amount (${forexAmount.toFixed(2)}) must be equal to Total Selected Invoice Amount (${totalInvoiceAmount.toFixed(2)}).`;
      this.disableSubmit = true;
      this.resetInvoiceCalculations(true); // Reset only the calculated values
      return; 
    }

    // If validation passes, calculate
    this.disableSubmit = false;

    this.biltisList.forEach((invoice: any) => {
      if (invoice.isSelected) {
        const invAmount = parseFloat(invoice.totalAmount) || 0;
        const proportion =
          totalInvoiceAmount > 0 ? invAmount / totalInvoiceAmount : 0;
        const distributedBankCharge = totalBankCharges * proportion;
        const totalAmountInr =
          invAmount * rateOfExchange + distributedBankCharge;

        invoice.calculatedBankCharges = distributedBankCharge;
        invoice.calculatedTotalINR = totalAmountInr;
      } else {
        invoice.calculatedBankCharges = 0;
        invoice.calculatedTotalINR = 0;
      }
    });
  }

  openPaymentModal() {
    this.selectedInvoiceIds = this.biltisList
      .filter((x: any) => x.isSelected)
      .map((x: any) => x.id);

    if (!this.selectedInvoiceIds.length) {
      this.toastr.error('Please select at least one invoice.');
      return;
    }

    this.paymentForm.reset();
    
    // Initial setup for Full Payment (default)
    this.paymentForm.patchValue({
      paymentType: 'full', // Set default type
      rate: this.selectedInvoicesTotal, // Pre-fill Forex amount
      quantity: 1,
      bankCharges: 0,
    });
    
    // Ensure the validators are active for Full Payment default
    this.paymentForm.get('rate')?.setValidators([Validators.required, Validators.min(0.01)]);
    this.paymentForm.get('bankCharges')?.setValidators([Validators.required, Validators.min(0)]);
    this.paymentForm.get('rate')?.updateValueAndValidity();
    this.paymentForm.get('bankCharges')?.updateValueAndValidity();
    
    this.resetInvoiceCalculations(); // Clear all partial/calculated fields
    this.calculateAmounts(); // Run initial calculation

    this.modalService.open(this.paymentModal, {
      size: 'xl', // Changed size to accommodate more columns
      backdrop: 'static',
    });
  }

  submitPayment() {
    const paymentType = this.paymentForm.get('paymentType')?.value;
    
    if (this.paymentForm.invalid && paymentType === 'full') {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }
    
    if (this.disableSubmit) {
        this.toastr.error(this.validationError || 'There are validation errors. Please check your amounts.');
        return;
    }
    
    // Logic for Full Payment
    if (paymentType === 'full') {
        const rate = parseFloat(this.paymentForm.get('rate')?.value) || 0;
        const bankChargesInput = parseFloat(this.paymentForm.get('bankCharges')?.value) || 0;
        const quantity = parseFloat(this.paymentForm.get('quantity')?.value) || 0;

        const paymentDetails = {
            // ... (rest of the full payment details)
            id: 0,
            paymentDate: this.convertNgbToDate(this.paymentForm.get('paymentDate')?.value),
            bankID: this.paymentForm.get('bankID')?.value,
            oWRMNo1: this.paymentForm.get('owrmNo1')?.value,
            oWRMNo2: this.paymentForm.get('owrmNo2')?.value,
            rate: rate,
            quantity: quantity,
            bankcharges: bankChargesInput,
            paymentCurrency: this.paymentForm.get('paymentCurrency')?.value,
            isPartial: false ,
            paymentMode: 'full' // Indicate full payment
        };
        
        const payload = {
          VendorInvoiceIds: this.selectedInvoiceIds,
          PaymentDetails: [paymentDetails],
        };
        
        // Final payload submission for Full Payment (assuming single payment detail structure)
        this.sendPaymentPayload(payload);

    } else if (paymentType === 'partial') {
        // Logic for Partial Payment: Create a list of payment details, one per invoice
        const quantity = parseFloat(this.paymentForm.get('quantity')?.value) || 0; // Rate of Exchange is still common
        
        const partialPaymentDetails = this.biltisList
            .filter((x: any) => x.isSelected)
            .map((invoice: any) => ({
                id: 0,
                paymentDate: this.convertNgbToDate(this.paymentForm.get('paymentDate')?.value),
                bankID: this.paymentForm.get('bankID')?.value,
                oWRMNo1: this.paymentForm.get('owrmNo1')?.value,
                oWRMNo2: this.paymentForm.get('owrmNo2')?.value,
                rate: parseFloat(invoice.partialAmount) || 0, // Rate becomes the Partial Amount for the invoice
                quantity: quantity,
                bankcharges: parseFloat(invoice.partialBankCharges) || 0, // Bank Charges are the user's input
                paymentCurrency: this.paymentForm.get('paymentCurrency')?.value,
                isPartial: true, // Indicate partial payment
                vendorInvoiceId: invoice.id,
                paymentMode: 'partial' // Pass the invoice ID with the specific payment detail
            }));

        const payload = {
          // Send all selected IDs, but the backend must recognize the per-invoice details
          VendorInvoiceIds: this.selectedInvoiceIds, 
          PaymentDetails: partialPaymentDetails,
          paymentMode: this.paymentForm.get('paymentType')?.value
           // Multiple payment details
        };
        
        // Final payload submission for Partial Payment
        this.sendPaymentPayload(payload);
    }
  }
  
  // New helper function for submission logic
  sendPaymentPayload(payload: any) {
    this.loadSpinner = true;
    this.biltiService.createBilti(payload).subscribe(
      () => {
        this.loadSpinner = false;
        this.toastr.success('Payment added successfully!');
        this.paymentForm.reset();
      },
      (error: any) => {
        this.loadSpinner = false;
        // console.error('Error while adding payment:', error);
        // this.toastr.error('Failed to add payment.');
        // console.error('Error while adding payment:', error);
        // this.toastr.success('Payment added successfully!');
      }
    );
  }

  // New helper function to clear calculation fields
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

  // The rest of your existing helper methods remain the same

  get selectedInvoicesTotal(): number {
    if (!this.biltisList) return 0;
    return this.biltisList
      .filter((x: { isSelected: any }) => x.isSelected)
      .reduce(
        (sum: any, x: { totalAmount: any }) => sum + (x.totalAmount || 0),
        0
      );
  }

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