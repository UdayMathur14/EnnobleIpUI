import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ToWords } from 'to-words';
import { CommonTransactionService } from '../../../core/service/commonTransaction.service';

@Component({
  selector: 'app-bilti-process-details-modal',
  templateUrl: './bilti-process-details.component.html',
  styleUrl: './bilti-process-details.component.scss',
})
export class BiltiProcessDetailsModalComponent implements OnInit {
  toWords = new ToWords();
  @Input() biltiProcess: any;
  biltiBillProcess!: FormGroup;
  biltiBillProcessData: any;

  loadSpinner: boolean = true;
  // Totals
  totalFreightCharge: number = 0;
  totalPointCharge: number = 0;
  totalDetentionCharge: number = 0;
  totalOverloadCharge: number = 0;
  totalTollTax: number = 0;
  totalUnloadingCharge: number = 0;
  totalOtherCharges: number = 0;
  grandTotalVendor: number = 0;

  // Define variables to store the total sum for each charge type in Charges by LG section
  totalLGFreightCharge: number = 0;
  totalLGPointCharge: number = 0;
  totalLGDetentionCharge: number = 0;
  totalLGOverloadCharge: number = 0;
  totalLGTollTax: number = 0;
  totalLGUnloadingCharge: number = 0;
  totalLGOtherCharges: number = 0;
  grandTotalLG: number = 0;

  grandTotal: number = 0;

  transactionTypeId: any;
  maxBiltiNumber: any;
  transacttionTypeCode: any;
  amountInWords: string = '';
  freightAmount: number = 0;
  showSaveButton: boolean = false;
  showApproveRejectButtons: boolean = false;
  fullPath:any;

  constructor(
    public activeModal: NgbActiveModal,
    private biltiBillService: BiltiBillProcessService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private commonTransaction: CommonTransactionService
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      this.fullPath = this.router.url;
      this.showSaveButton = this.fullPath.includes('transaction/biltiBillProcess');
      this.showApproveRejectButtons = this.fullPath.includes('transaction/approvalAccounts') ||
      this.fullPath.includes('transaction/checkedMaterialsTeam') || this.fullPath.includes('transaction/approvalMaterialHead');
    });
    console.log(this.biltiProcess)
    this.initForm();
    this.getBiltiBillProcessbyId();
  }

  initForm(): void {
    this.biltiBillProcess = this.formBuilder.group({
      biltiNumber: [''],
      creationDate: [''],
      adviceType: [''],
      documentNumber: [''],
      vendorName: [''],
      freightAmount: [''],
      penaltyAmount: [''],
      penaltyReason: [''],
      excessAmount: [''],
      excessReason: [''],
      lgRemarks: [''],
      freightChargeLg: [0],
      pointChargeLg: [0],
      detentionChargeLg: [0],
      overloadChargeLg: [0],
      tollTaxLg: [0],
      unloadingChargeLg: [0],
      otherChargeLg: [0],
      rejectRemarks: [''],
      biltiCreationLineItemDetails: this.formBuilder.array([]),
    });
  }

  get biltiCreationLineItemDetails(): FormArray {
    return this.biltiBillProcess.get(
      'biltiCreationLineItemDetails'
    ) as FormArray;
  }

  createLineItem(item: any): FormGroup {
    return this.formBuilder.group({
      documentNumber: [item?.fRMTransactionDetails?.documentNumber || ''],
      vendorName: [item?.supplierDetail?.vendorName || ''],
      freightCharge: [item?.biltiBillProcessChargesByVendor?.freightCharge || 0],
      pointCharge: [item?.biltiBillProcessChargesByVendor?.pointCharge || 0],
      detentionCharge: [item?.biltiBillProcessChargesByVendor?.detentionCharge || 0],
      overloadCharge: [item?.biltiBillProcessChargesByVendor?.overloadCharge || 0],
      tollTax: [item?.biltiBillProcessChargesByVendor?.tollTax || 0],
      unloadingCharge: [item?.biltiBillProcessChargesByVendor?.unloadingCharge || 0],
      otherCharges: [item?.biltiBillProcessChargesByVendor?.otherCharges || 0],
      remarks: [item?.biltiBillProcessChargesByVendor?.remarks || ''],
    });
    
  }

  getBiltiBillProcessbyId() {
    this.biltiBillService
      .getBiltiBillProcessbyId(this.biltiProcess.id)
      .subscribe((response) => {
        this.biltiBillProcessData = response;
        this.transactionTypeId = this.biltiBillProcessData.transactionTypeId;
        this.maxBiltiNumber =
          this.biltiBillProcessData.transactionTypeDetails.adviceTypeDetails.maxBiltiNumber;
        this.transacttionTypeCode =
          this.biltiBillProcessData.transactionTypeDetails.code;
        this.populateForm();
      });
  }

  populateForm(): void {
    console.log(this.biltiBillProcessData)
    if(this.biltiBillProcessData?.biltiBillProcessModel){
      const freightChargeLg = this.biltiBillProcessData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.freightCharge;
      const pointChargeLg = this.biltiBillProcessData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.pointCharge;
      const detentionChargeLg = this.biltiBillProcessData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.detentionCharge;
      const overloadChargeLg = this.biltiBillProcessData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.overloadCharge;
      const tollTaxLg = this.biltiBillProcessData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.tollTax;
      const unloadingChargeLg = this.biltiBillProcessData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.unloadingCharge;
      const otherChargeLg = this.biltiBillProcessData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.otherCharges;
      this.grandTotalLG = freightChargeLg + pointChargeLg + detentionChargeLg +
      overloadChargeLg + tollTaxLg + unloadingChargeLg + otherChargeLg;
    }
    if (this.biltiBillProcessData) {
      // this.calculateTotals();
      this.calculateDifference()
      this.biltiBillProcess.patchValue({
        biltiNumber: this.biltiBillProcessData.biltiNumber,
        creationDate: this.biltiBillProcessData.creationDate,
        adviceType: this.biltiBillProcessData.transactionTypeDetails?.name,
        freightAmount: this.biltiBillProcessData.freightDetails?.freightAmount,
        penaltyAmount: this.biltiBillProcessData.biltiBillProcessModel?.penaltyAmount,
        excessAmount: this.biltiBillProcessData.biltiBillProcessModel?.excessAmount,
        penaltyReason: this.biltiBillProcessData.biltiBillProcessModel?.penaltyReason,
        excessReason: this.biltiBillProcessData.biltiBillProcessModel?.excessReason,
        freightChargeLg: this.biltiBillProcessData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.freightCharge,
        pointChargeLg: this.biltiBillProcessData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.pointCharge,
        detentionChargeLg: this.biltiBillProcessData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.detentionCharge,
        overloadChargeLg: this.biltiBillProcessData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.overloadCharge,
        tollTaxLg: this.biltiBillProcessData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.tollTax,
        unloadingChargeLg: this.biltiBillProcessData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.unloadingCharge,
        otherChargeLg: this.biltiBillProcessData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.otherCharges,
        lgRemarks: this.biltiBillProcessData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.remarks,
      });
      const biltiCreationLineItemDetailsData =
        this.biltiBillProcessData.biltiCreationLineItemDetails;

        const chargesbyVendorData =
        this.biltiBillProcessData?.biltiCreationLineItemDetails;

      if (biltiCreationLineItemDetailsData) {
        const formArray = this.biltiBillProcess.get(
          'biltiCreationLineItemDetails'
        ) as FormArray;
        formArray.clear();

        biltiCreationLineItemDetailsData.forEach((item: any) => {
          formArray.push(this.createLineItem(item));
        });
        chargesbyVendorData.forEach((item: any) => {
          const freightCharge = item?.biltiBillProcessChargesByVendor?.freightCharge || 0;
          const pointCharge = item?.biltiBillProcessChargesByVendor?.pointCharge || 0;
          const detentionCharge = item?.biltiBillProcessChargesByVendor?.detentionCharge || 0;
          const overloadCharge = item?.biltiBillProcessChargesByVendor?.overloadCharge || 0;
          const tollTax = item?.biltiBillProcessChargesByVendor?.tollTax || 0;
          const unloadingCharge = item?.biltiBillProcessChargesByVendor?.unloadingCharge || 0;
          const otherCharges = item?.biltiBillProcessChargesByVendor?.otherCharges || 0;
          this.totalFreightCharge += freightCharge;
          this.totalPointCharge += pointCharge;
          this.totalDetentionCharge += detentionCharge;
          this.totalOverloadCharge += overloadCharge;
          this.totalTollTax += tollTax;
          this.totalUnloadingCharge += unloadingCharge;
          this.totalOtherCharges += otherCharges;
          this.grandTotalVendor = this.totalFreightCharge +  this.totalPointCharge +this.totalDetentionCharge +
          this.totalOverloadCharge + this.totalTollTax + this.totalUnloadingCharge + this.totalOtherCharges
        });
        this.grandTotal = this.grandTotalLG + this.grandTotalVendor;
        this.amountInWords = '('+this.toWords.convert(this.grandTotal) + ' Rupees Only)';
      }
    }
  }

  calculateTotals(): void {
    this.totalFreightCharge = this.sumColumn('freightCharge');
    this.totalPointCharge = this.sumColumn('pointCharge');
    this.totalDetentionCharge = this.sumColumn('detentionCharge');
    this.totalOverloadCharge = this.sumColumn('overloadCharge');
    this.totalTollTax = this.sumColumn('tollTax');
    this.totalUnloadingCharge = this.sumColumn('unloadingCharge');
    this.totalOtherCharges = this.sumColumn('otherCharges');

    this.grandTotalVendor =
      this.totalFreightCharge +
      this.totalPointCharge +
      this.totalDetentionCharge +
      this.totalOverloadCharge +
      this.totalTollTax +
      this.totalUnloadingCharge +
      this.totalOtherCharges;

    this.calculateTotalLGCharges();
    this.calculateDifference();
  }

  calculateTotalLGCharges(): void {
    const formValue = this.biltiBillProcess.value;
    this.totalLGFreightCharge = parseFloat(formValue.freightChargeLg) || 0;
    this.totalLGPointCharge = parseFloat(formValue.pointChargeLg) || 0;
    this.totalLGDetentionCharge = parseFloat(formValue.detentionChargeLg) || 0;
    this.totalLGOverloadCharge = parseFloat(formValue.overloadChargeLg) || 0;
    this.totalLGTollTax = parseFloat(formValue.tollTaxLg) || 0;
    this.totalLGUnloadingCharge = parseFloat(formValue.unloadingChargeLg) || 0;
    this.totalLGOtherCharges = parseFloat(formValue.otherChargeLg) || 0;

    this.grandTotalLG =
      this.totalLGFreightCharge +
      this.totalLGPointCharge +
      this.totalLGDetentionCharge +
      this.totalLGOverloadCharge +
      this.totalLGTollTax +
      this.totalLGUnloadingCharge +
      this.totalLGOtherCharges;
    this.grandTotalSum();
    this.calculateDifference();
  }

  calculateDifference(): void {
     this.freightAmount =
      this.biltiBillProcessData?.freightDetails?.freightAmount || 0;
    const difference = this.grandTotalLG - this.freightAmount;

    let excessAmount = 0;
    let penaltyAmount = 0;

    if (this.grandTotalLG == 0 || difference == 0) {
      excessAmount = 0;
      penaltyAmount = 0;
      this.biltiBillProcess.get('penaltyReason')?.enable();
      this.biltiBillProcess.get('excessReason')?.enable();
    } else if (difference > 0) {
      excessAmount = difference;
      penaltyAmount = 0;
      this.biltiBillProcess.get('penaltyReason')?.disable();
      this.biltiBillProcess.get('excessReason')?.enable();
    } else if (difference < 0) {
      penaltyAmount = Math.abs(difference);
      excessAmount = 0;
      this.biltiBillProcess.get('penaltyReason')?.enable();
      this.biltiBillProcess.get('excessReason')?.disable();
    } else if (difference == 0) {
      this.biltiBillProcess.get('penaltyReason')?.enable();
      this.biltiBillProcess.get('excessReason')?.enable();
    } else {
      penaltyAmount = 0;
      excessAmount = 0;
      this.biltiBillProcess.get('penaltyReason')?.enable();
      this.biltiBillProcess.get('excessReason')?.enable();
    }

    this.biltiBillProcess.patchValue({
      penaltyAmount: penaltyAmount,
      excessAmount: excessAmount,
    });
  }

  sumColumn(column: string): number {
    return this.biltiCreationLineItemDetails.controls.reduce(
      (total: number, control: AbstractControl) => {
        const value =
          parseFloat((control as FormGroup).get(column)?.value) || 0;
        return total + value;
      },
      0
    );
  }

  grandTotalSum() {
    this.grandTotal = this.grandTotalLG + this.grandTotalVendor;
    this.amountInWords = '('+this.toWords.convert(this.grandTotal) + ' Rupees Only)';
  }

  onPressSave() {
    const data = this.constructPayload();
    const editData = this.constructPayloadEdit()
    if(this.biltiProcess.biltiBillProcessModel){
      this.updateBiltiProcess(editData);
    } else{
      this.createBiltiProcess(data);
    }
  }

  sumRowDebits(control: AbstractControl): number {
    const formGroup = control as FormGroup;
    const debitAmount = Number(formGroup.get('debitAmount')?.value) || 0;
    const charges = [
      Number(formGroup.get('freightCharge')?.value) || 0,
      Number(formGroup.get('pointCharge')?.value) || 0,
      Number(formGroup.get('detentionCharge')?.value) || 0,
      Number(formGroup.get('overloadCharge')?.value) || 0,
      Number(formGroup.get('tollTax')?.value) || 0,
      Number(formGroup.get('unloadingCharge')?.value) || 0,
      Number(formGroup.get('otherCharges')?.value) || 0,
    ];
    return debitAmount + charges.reduce((total, value) => total + value, 0);
  }

  constructPayload(): any {
    const chargesByLGDetails = {
      id: 0,
      actionBy: 1,
      status: 'Active',
      freightCharge: this.biltiBillProcess.controls['freightChargeLg'].value,
      pointCharge: this.biltiBillProcess.controls['pointChargeLg'].value,
      detentionCharge: this.biltiBillProcess.controls['detentionChargeLg'].value,
      overloadCharge: this.biltiBillProcess.controls['overloadChargeLg'].value,
      tollTax: this.biltiBillProcess.controls['tollTaxLg'].value,
      unloadingCharge: this.biltiBillProcess.controls['unloadingChargeLg'].value,
      otherCharges: this.biltiBillProcess.controls['otherChargeLg'].value,
      remarks: this.biltiBillProcess.controls['lgRemarks'].value,
    };

    const chargesByVendorDetails =
      this.biltiCreationLineItemDetails.controls.map(
        (control: AbstractControl, index: number) => {
          const formGroup = control as FormGroup;
          const lineItemId =
            this.biltiBillProcessData.biltiCreationLineItemDetails[index]?.id ||
            0;
          return {
            id: 0,
            actionBy: 1,
            status: formGroup.get('status')?.value || 'Active',
            creationLineItemId: lineItemId,
            freightCharge: Number(formGroup.get('freightCharge')?.value) || 0,
            pointCharge: Number(formGroup.get('pointCharge')?.value) || 0,
            detentionCharge:
              Number(formGroup.get('detentionCharge')?.value) || 0,
            overloadCharge: Number(formGroup.get('overloadCharge')?.value) || 0,
            tollTax: Number(formGroup.get('tollTax')?.value) || 0,
            unloadingCharge:
              Number(formGroup.get('unloadingCharge')?.value) || 0,
            otherCharges: Number(formGroup.get('otherCharges')?.value) || 0,
            remarks: formGroup.get('remarks')?.value || '',
            debitAmount: this.sumRowDebits(control),
            debitRemarks: formGroup.get('debitRemarks')?.value || '',
          };
        }
      );

    return {
      actionBy: 1,
      attribute1: 'string',
      attribute2: 'string',
      attribute3: 'string',
      attribute4: 'string',
      attribute5: 0,
      attribute6: 0,
      attribute7: 0,
      attribute8: 0,
      attribute9: new Date().toISOString(),
      attribute10: new Date().toISOString(),
      biltiCreationId: this.biltiProcess.id,
      transactionTypeId: this.transactionTypeId,
      maxBiltiNumber: this.maxBiltiNumber,
      transactionTypeCode: this.transacttionTypeCode,
      paidByAmount: this.grandTotal,
      debitAmount: this.grandTotalVendor,
      penaltyAmount: this.biltiBillProcess.get('penaltyAmount')?.value || 0,
      penaltyReason: this.biltiBillProcess.get('penaltyReason')?.value || '',
      excessAmount: this.biltiBillProcess.get('excessAmount')?.value || 0,
      excessReason: this.biltiBillProcess.get('excessReason')?.value || '',
      grandTotal: this.grandTotal,
      chargesByLGDetails: chargesByLGDetails,
      chargesByVendorDetails: chargesByVendorDetails,
    };
  }

  constructPayloadEdit(): any {
    const chargesByLGDetails = {
      id: this.biltiBillProcessData?.biltiBillProcessModel?.biltiBillProcessChargesByLG?.id,
      actionBy: 1,
      status: 'Active',
      freightCharge: this.biltiBillProcess.controls['freightChargeLg'].value,
      pointCharge: this.biltiBillProcess.controls['pointChargeLg'].value,
      detentionCharge: this.biltiBillProcess.controls['detentionChargeLg'].value,
      overloadCharge: this.biltiBillProcess.controls['overloadChargeLg'].value,
      tollTax: this.biltiBillProcess.controls['tollTaxLg'].value,
      unloadingCharge: this.biltiBillProcess.controls['unloadingChargeLg'].value,
      otherCharges: this.biltiBillProcess.controls['otherChargeLg'].value,
      remarks: this.biltiBillProcess.controls['lgRemarks'].value,
      grandTotal: this.grandTotal,
    };

    const chargesByVendorDetails =
      this.biltiCreationLineItemDetails.controls.map(
        (control: AbstractControl, index: number) => {
          const formGroup = control as FormGroup;
          const lineItemId =
            this.biltiBillProcessData.biltiCreationLineItemDetails[index]?.id ||
            0;
            const vendorId = this.biltiBillProcessData.biltiCreationLineItemDetails[index]?.biltiBillProcessChargesByVendor?.id
          return {
            id: vendorId,
            actionBy: 1,
            status: formGroup.get('status')?.value || 'Active',
            creationLineItemId: lineItemId,
            freightCharge: Number(formGroup.get('freightCharge')?.value) || 0,
            pointCharge: Number(formGroup.get('pointCharge')?.value) || 0,
            detentionCharge:
              Number(formGroup.get('detentionCharge')?.value) || 0,
            overloadCharge: Number(formGroup.get('overloadCharge')?.value) || 0,
            tollTax: Number(formGroup.get('tollTax')?.value) || 0,
            unloadingCharge:
              Number(formGroup.get('unloadingCharge')?.value) || 0,
            otherCharges: Number(formGroup.get('otherCharges')?.value) || 0,
            remarks: formGroup.get('remarks')?.value || '',
            debitAmount: this.sumRowDebits(control),
            debitRemarks: formGroup.get('debitRemarks')?.value || '',
          };
        }
      );

    return {
      id: this.biltiBillProcessData?.biltiBillProcessModel?.id,
      actionBy: 1,
      status: this.biltiBillProcessData?.biltiBillProcessModel?.status,

      // biltiCreationId: this.biltiProcess.id,
      // transactionTypeId: this.transactionTypeId,
      // maxBiltiNumber: this.maxBiltiNumber,
      // transactionTypeCode: this.transacttionTypeCode,
      paidByAmount: this.grandTotal,
      debitAmount: this.grandTotalVendor,
      penaltyAmount: this.biltiBillProcess.get('penaltyAmount')?.value || 0,
      penaltyReason: this.biltiBillProcess.get('penaltyReason')?.value || '',
      excessAmount: this.biltiBillProcess.get('excessAmount')?.value || 0,
      excessReason: this.biltiBillProcess.get('excessReason')?.value || '',
      grandTotal: this.grandTotal,
      chargesByLGDetails: chargesByLGDetails,
      chargesByVendorDetails: chargesByVendorDetails,
    };
  }

  createBiltiProcess(data: any) {
    this.biltiBillService.createBiltiBillProcess(data).subscribe(
      (response: any) => {
        this.loadSpinner = false;
        this.toastr.success('Bilti Bill Process Created Successfully');
        this.activeModal.close('save');
      },
      (error) => {
        this.toastr.error(error.statusText, error.status);
        this.loadSpinner = false;
      }
    );
  }

  updateBiltiProcess(data: any) {
    this.biltiBillService.updateBiltiBillProcess(this.biltiBillProcessData?.biltiBillProcessModel?.id,data).subscribe(
      (response: any) => {
        this.loadSpinner = false;
        this.toastr.success('Bilti Bill Process Updated Successfully');
        this.activeModal.close('save');
      },
      (error) => {
        this.toastr.error(error.statusText, error.status);
        this.loadSpinner = false;
        
      }
    );
  }

  approveAccountsPayload(){
    
  }

  updateStatus(status: string) {
    if (status === 'Rejected') {
      const rejectRemarks = this.biltiBillProcess.controls['rejectRemarks']?.value;
      if (!rejectRemarks || rejectRemarks.trim().length === 0) {
        this.toastr.error('Remarks are required when rejecting.');
        return;
      }
    }
    if(this.fullPath.includes('transaction/approvalAccounts') || this.fullPath.includes('transaction/approvalMaterialHead')){
      const data = {
        approvalLevel: 'Material',
        status: status,
        remarks: this.biltiBillProcess.controls['rejectRemarks']?.value || "",
        actionBy: 1,
        transactionCode: 203,
      };
   
    this.commonTransaction.updateStatus(this.biltiProcess.id, data).subscribe((response: any) => {
      this.loadSpinner = false;
      this.toastr.success('Status Updated Successfully');
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    });
  }
  else {
    const data = {
      approvalLevel: 'MaterialChecked',
      status: status,
      remarks: this.biltiBillProcess.controls['rejectRemarks']?.value || "",
      actionBy: 1,
      transactionCode: 203,
    };
 
  this.commonTransaction.updateStatus(this.biltiProcess.id, data).subscribe((response: any) => {
    this.loadSpinner = false;
    this.toastr.success('Status Updated Successfully');
  }, error => {
    this.toastr.error(error.statusText, error.status);
    this.loadSpinner = false;
  });
}
}
}
