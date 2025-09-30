import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionTypeModalComponent } from '../../../../modals/transaction-type/transaction-type.component';
import { DeliveryNoteModalComponent } from '../../../../modals/delivery-note/delivery-note.component';
import { BiltiService } from '../../../../../core/service/bilti.service';
import { ToastrService } from 'ngx-toastr';
import { BiltiPdfModalComponent } from '../../../../modals/bilti-pdf/bilti-pdf.component';
import { APIConstant } from '../../../../../core/constants';
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
  private fb: FormBuilder = new FormBuilder;
  selectedInvoiceId: any;

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
  }

  

    createPaymentFeeDetailsGroup() {
      const detail = this.fb.group({
        id: [0],
        paymentDate: ['', [Validators.required]],
        bankID: ['', [Validators.required]],
        owrmNo1: ['', [Validators.required]],
        owrmNo2: [''],
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

     get paymentFeeDetails(): FormArray {
        return this.paymentFreeDetails.get(
          'paymentFeeDetails'
        ) as FormArray;
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

  onDateSelect(type: string, e: any) {
    const month = Number(e.month) < 10 ? '0' + e.month : e.month;
    const day = Number(e.day) < 10 ? '0' + e.day : e.day;
    console.log(e);
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

 submitPayment() {
  if (!this.paymentFreeDetails || this.paymentFeeDetails.length === 0) {
    this.toastr.error('Please add at least one payment entry.');
    return;
  }

  // ✅ Take the first form group since you're entering a single record
  const formValue = this.paymentFeeDetails.at(0).value;

  // Create request payload based on your backend model
  const payload = {
    VendorInvoiceIds: [this.selectedInvoiceId], // Assuming you have a single invoice selected
    PaymentDetails: [
      {
        id: formValue.id || 0,
        paymentDate: formValue.paymentDate,
        bankID: formValue.bankID,
        oWRMNo1: formValue.owrmNo1,  // ✅ Match property name exactly
        oWRMNo2: formValue.owrmNo2,
        rate: formValue.rate,
        quantity: formValue.quantity,
        bankcharges: formValue.bankCharges,
        totalAmountInr: formValue.totalAmountInr,
        paymentCurrency: formValue.paymentCurrency,
        paymentAmount: formValue.paymentAmount
      }
    ]
  };

  console.log('Payload to submit:', payload);

  this.loadSpinner = true;

  // ✅ Call the service
  this.biltiService.createBilti(payload).subscribe(
    (response: any) => {
      this.loadSpinner = false;
      this.toastr.success('Payment added successfully!');

      // Reset form after submit
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


    
  
}
