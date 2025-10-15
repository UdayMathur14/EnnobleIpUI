import {
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
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

  @ViewChild('paymentModal') paymentModal: any;

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
    this.paymentForm = this.fb.group({
      paymentDate: ['', [Validators.required]],
      bankID: ['', [Validators.required]],
      owrmNo1: ['', [Validators.required]],
      owrmNo2: [''],
      rate: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      paymentCurrency: ['', [Validators.required]],
      bankCharges: [0, [Validators.required, Validators.min(0)]],
    });

    this.setupSubscriptions(this.paymentForm);
  }

setupSubscriptions(group: FormGroup) {
  group.valueChanges.subscribe((val) => {
    const paymentDetail = group.value;

    // check if forex amount = total of selected invoices
    if (paymentDetail.rate === this.selectedInvoicesTotal) {
      this.biltisList.forEach((invoice: any) => {
        invoice.bankCharges = (invoice.totalAmount / paymentDetail.rate) * paymentDetail.bankCharges;
        invoice.totalAmountInr = (invoice.totalAmount * paymentDetail.quantity) + invoice.bankCharges;
        invoice.owrmNo = paymentDetail.owrmNo1;
        invoice.paymentDate = paymentDetail.paymentDate;
      });
    } else {
      // reset invoice rows
      this.biltisList.forEach((invoice: any) => {
        invoice.bankCharges = 0;
        invoice.totalAmountInr = 0;
        invoice.owrmNo = '';
        invoice.paymentDate = null;
      });
    }
  });
}
  calculateForAllInvoices() {
  const rate = parseFloat(this.paymentForm.get('rate')?.value) || 0;
  const bankChargesInput = parseFloat(this.paymentForm.get('bankCharges')?.value) || 0;
  const quantity = parseFloat(this.paymentForm.get('quantity')?.value) || 0;

  this.biltisList
    .filter((x: any) => x.isSelected)
    .forEach((invoice: any) => {
      const totalAmount = invoice.totalAmount || 0;
      const bankCharges = (totalAmount / rate) * bankChargesInput;
      const totalInr = (totalAmount * quantity) + bankCharges;

      invoice.calculatedBankCharges = bankCharges;
      invoice.calculatedTotalINR = totalInr;
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
    this.paymentForm.patchValue({
      rate: 0,
      quantity: 1,
      bankCharges: 0,
    });

    this.modalService.open(this.paymentModal, {
      size: 'lg',
      backdrop: 'static',
    });
  }

  submitPayment() {
    if (this.paymentForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    const rate = parseFloat(this.paymentForm.get('rate')?.value) || 0;
    const bankChargesInput = parseFloat(this.paymentForm.get('bankCharges')?.value) || 0;
    const quantity = parseFloat(this.paymentForm.get('quantity')?.value) || 0;

    const paymentDetails = {
      id: 0,
      paymentDate: this.convertNgbToDate(this.paymentForm.get('paymentDate')?.value),
      bankID: this.paymentForm.get('bankID')?.value,
      oWRMNo1: this.paymentForm.get('owrmNo1')?.value,
      oWRMNo2: this.paymentForm.get('owrmNo2')?.value,
      rate: rate,
      quantity: quantity,
      bankcharges: bankChargesInput,
      paymentCurrency: this.paymentForm.get('paymentCurrency')?.value,
    };

    const payload = {
      VendorInvoiceIds: this.selectedInvoiceIds,
      PaymentDetails: [paymentDetails],
    };

    this.loadSpinner = true;
    this.biltiService.createBilti(payload).subscribe(
      () => {
        this.loadSpinner = false;
        this.toastr.success('Payment added successfully!');
        this.paymentForm.reset();
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
      .filter((x: { isSelected: any }) => x.isSelected)
      .reduce(
        (sum: any, x: { totalAmount: any }) => sum + (x.totalAmount || 0),
        0
      );
  }

  getPaymentCurrencyList() {
    this.loadSpinner = true;
    this.lookupService.getDropdownData('Currency').subscribe((response: any) => {
      this.currencyList = response.lookUps || [];
      this.loadSpinner = false;
    });
  }

  getAllTransactionTypes(offset: number = 0, count: number = 0, filters: any = '') {
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

updateInvoiceCalculations(paymentDetail: any) {
  this.biltisList.forEach((invoice: any) => {
    invoice.bankCharges = (invoice.totalAmount / paymentDetail.rate) * paymentDetail.bankCharges;
    invoice.totalAmountInr = (invoice.totalAmount * paymentDetail.quantity) + invoice.bankCharges;
  });
}

// call this when modal inputs change




}
