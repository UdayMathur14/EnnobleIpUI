import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-bilti-process-details-modal',
  templateUrl: './bilti-process-details.component.html',
  styleUrl: './bilti-process-details.component.scss'
})
export class BiltiProcessDetailsModalComponent implements OnInit {
  @Input() biltiProcess: any;
  biltiBillProcess!: FormGroup;
  biltiBillProcessData: any;

  // Totals
  totalFreightCharge: number = 0;
  totalPointCharge: number = 0;
  totalDetentionCharge: number = 0;
  totalOverloadCharge: number = 0;
  totalTollTax: number = 0;
  totalUnloadingCharge: number = 0;
  totalOtherCharges: number = 0;
  grandTotal: number = 0;

  // Define variables to store the total sum for each charge type in Charges by LG section
totalLGFreightCharge: number = 0;
totalLGPointCharge: number = 0;
totalLGDetentionCharge: number = 0;
totalLGOverloadCharge: number = 0;
totalLGTollTax: number = 0;
totalLGUnloadingCharge: number = 0;
totalLGOtherCharges: number = 0;
grandTotalLG:number = 0;


  constructor(
    public activeModal: NgbActiveModal,
    private biltiBillService: BiltiBillProcessService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

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
      biltiCreationLineItemDetails: this.formBuilder.array([])
    });
  }

  get biltiCreationLineItemDetails(): FormArray {
    return this.biltiBillProcess.get('biltiCreationLineItemDetails') as FormArray;
  }

  createLineItem(item: any): FormGroup {
    return this.formBuilder.group({
      documentNumber: [item.fRMTransactionDetails?.documentNumber || ''],
      vendorName: [item.supplierDetail?.vendorName || ''],
      freightCharge: [item.freightCharge || 0],
      pointCharge: [item.pointCharge || 0],
      detentionCharge: [item.detentionCharge || 0],
      overloadCharge: [item.overloadCharge || 0],
      tollTax: [item.tollTax || 0],
      unloadingCharge: [item.unloadingCharge || 0],
      otherCharges: [item.otherCharges || 0],
      remarks: [item.remarks || '']
    });
  }

  getBiltiBillProcessbyId() {
    this.biltiBillService.getBiltiBillProcessbyId(this.biltiProcess.id).subscribe((response => {
      console.log(response, "response");
      this.biltiBillProcessData = response;
      console.log(this.biltiBillProcessData.biltiNumber, "this.biltiBillProcessData");

      console.log(this.biltiBillProcessData.biltiCreationLineItemDetails?.supplierDetail?.vendorName, "vendor Name");

      this.populateForm();
    }))
  }

  populateForm(): void {

    this.biltiBillProcess.patchValue({
      biltiNumber: this.biltiBillProcessData?.biltiNumber,
      creationDate: this.biltiBillProcessData?.creationDate,
      adviceType: this.biltiBillProcessData.transactionTypeDetails?.name,
      // vendorName: vendorNames,
      freightAmount: this.biltiBillProcessData.freightDetails?.freightAmount,
      penaltyAmount: this.biltiBillProcessData.biltiBillProcessModel?.penaltyAmount,
      penaltyReason: this.biltiBillProcessData.biltiBillProcessModel?.penaltyReason,
      excessAmount: this.biltiBillProcessData.biltiBillProcessModel?.excessAmount,
      excessReason: this.biltiBillProcessData.biltiBillProcessModel?.excessReason
    });
    const biltiCreationLineItemDetailsData = this.biltiBillProcessData?.biltiCreationLineItemDetails;

    if (biltiCreationLineItemDetailsData) {
      const formArray = this.biltiBillProcess.get('biltiCreationLineItemDetails') as FormArray;

      // Clear existing form array controls
      formArray.clear();

      // Populate form array with new form groups
      biltiCreationLineItemDetailsData.forEach((item: any) => {
        formArray.push(this.createLineItemFormGroup(item));
      });
    }
  }

  createLineItemFormGroup(item: any): FormGroup {
    return this.formBuilder.group({
      // Define your form controls here and set their initial values
      documentNumber: [item.fRMTransactionDetails?.documentNumber || ''],
      vendorName: [item.supplierDetail?.vendorName || ''],
      freightCharge: [item.freightCharge || ''],
      pointCharge: [item.pointCharge || ''],
      detentionCharge: [item.detentionCharge || ''],
      overloadCharge: [item.overloadCharge || ''],
      tollTax: [item.tollTax || ''],
      unloadingCharge: [item.unloadingCharge || ''],
      otherCharges: [item.otherCharges || ''],
      remarks: [item.remarks || '']
    });
  }

  calculateTotals(): void {
    this.totalFreightCharge = this.sumColumn('freightCharge');
    this.totalPointCharge = this.sumColumn('pointCharge');
    this.totalDetentionCharge = this.sumColumn('detentionCharge');
    this.totalOverloadCharge = this.sumColumn('overloadCharge');
    this.totalTollTax = this.sumColumn('tollTax');
    this.totalUnloadingCharge = this.sumColumn('unloadingCharge');
    this.totalOtherCharges = this.sumColumn('otherCharges');

     this.grandTotal = this.totalFreightCharge + this.totalPointCharge + this.totalDetentionCharge +
                    this.totalOverloadCharge + this.totalTollTax + this.totalUnloadingCharge +
                    this.totalOtherCharges;
  }

  calculateTotalLGCharges(): void {
    // Calculate the total sum for each charge type
    this.totalLGFreightCharge = parseFloat((document.getElementById('lgFreightCharge') as HTMLInputElement).value) || 0;
    this.totalLGPointCharge = parseFloat((document.getElementById('lgPointCharge') as HTMLInputElement).value) || 0;
    this.totalLGDetentionCharge = parseFloat((document.getElementById('lgDetentionCharge') as HTMLInputElement).value) || 0;
    this.totalLGOverloadCharge = parseFloat((document.getElementById('lgOverloadCharge') as HTMLInputElement).value) || 0;
    this.totalLGTollTax = parseFloat((document.getElementById('lgTollTax') as HTMLInputElement).value) || 0;
    this.totalLGUnloadingCharge = parseFloat((document.getElementById('lgUnloadingCharge') as HTMLInputElement).value) || 0;
    this.totalLGOtherCharges = parseFloat((document.getElementById('lgOtherCharges') as HTMLInputElement).value) || 0;
     // Calculate the grand total for Charges by LG
  this.grandTotalLG = this.totalLGFreightCharge + this.totalLGPointCharge + this.totalLGDetentionCharge +
  this.totalLGOverloadCharge + this.totalLGTollTax + this.totalLGUnloadingCharge +
  this.totalLGOtherCharges;
  }

  sumColumn(column: string): number {
    return this.biltiCreationLineItemDetails.controls.reduce((total: number, control: AbstractControl) => {
      const value = parseFloat((control as FormGroup).get(column)?.value) || 0;
      return total + value;
    }, 0);
  }

}
