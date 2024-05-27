import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-debit-note-details-modal',
  templateUrl: './debit-note-details.component.html',
  styleUrl: './debit-note-details.component.scss',
})
export class DebitNoteDetailsModalComponent implements OnInit {
  @Input() biltiProcess: any;
  loadSpinner: boolean = false;
  biltiBillDetails!: FormGroup;
  biltiBillDetailsData: any;
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private biltiBillService: BiltiBillProcessService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  ngOnInit(): void {

    this.initForm();
    this.getBiltiBillProcessbyId();
  }
  initForm(): void {
    this.biltiBillDetails = this.formBuilder.group({
      biltiNumber: [''],
      creationDate: [''],
      adviceType: [''],
      vendorName: [''],
      freightAmount: [''],
      paidByDetails: [''],
      remarks: [''],
      debitRemarks: [''],
      debitAmount: [''],
      biltiCreationLineItemDetails: this.formBuilder.array([]),
    });
  }

  get biltiCreationLineItemDetails(): FormArray {
    return this.biltiBillDetails.get(
      'biltiCreationLineItemDetails'
    ) as FormArray;
  }

  createLineItem(item: any): FormGroup {
    return this.formBuilder.group({
      paidByDetails: [item.supplierDetail?.paidByDetails?.value || ''],
      vendorName: [item.supplierDetail?.vendorName || ''],
      remarks: [this.biltiProcess?.loadingLocation?.value],
      id: [item.id],
      debitAmount: [item?.biltiBillProcessChargesByVendor?.debitAmount || 0,
      ],
      debitRemarks: [],
    });
  }

  getBiltiBillProcessbyId() {
    this.biltiBillService
      .getBiltiBillProcessbyId(this.biltiProcess.id)
      .subscribe((response) => {
        this.biltiBillDetailsData = response;
        // this.transactionTypeId = this.biltiBillProcessData.transactionTypeId;
        // this.maxBiltiNumber = this.biltiBillProcessData.transactionTypeDetails.adviceTypeDetails.maxBiltiNumber;
        // this.transacttionTypeCode = this.biltiBillProcessData.transactionTypeDetails.code;
        this.populateForm();
      });
  }

  populateForm(): void {
    console.log(this.biltiBillDetailsData)
    if (this.biltiBillDetailsData) {
      // this.calculateTotals();
      this.biltiBillDetails.patchValue({
        biltiNumber: this.biltiBillDetailsData.biltiNumber,
        creationDate: this.biltiBillDetailsData.creationDate,
        adviceType: this.biltiBillDetailsData.transactionTypeDetails?.name,
        freightAmount:
          this.biltiBillDetailsData.biltiBillProcessModel?.debitAmount,
      });

      const biltiCreationLineItemDetailsData =
        this.biltiBillDetailsData.biltiCreationLineItemDetails;

      if (biltiCreationLineItemDetailsData) {
        const formArray = this.biltiBillDetails.get(
          'biltiCreationLineItemDetails'
        ) as FormArray;
        formArray.clear();

        biltiCreationLineItemDetailsData.forEach((item: any) => {
          formArray.push(this.createLineItem(item));
        });
      }
    }
  }
  // OnPressSave(){
  //   const data = {

  //   }

  //   this.biltiBillService.updateBiltiBillProcess(this.biltiProcess.id, data).subscribe(
  //     (response: any) => {
  //       // this.biltiData = response;
  //       this.toastr.success('Bilti Updated Successfully');
  //       this.router.navigate(['transaction/bilti'])
  //       this.loadSpinner = false;
  //     },
  //     (error) => {
  //       this.toastr.error(error.statusText, error.status);
  //       this.loadSpinner = false;
  //     }
  //   );
  // }
  OnPressSave() {
    this.loadSpinner = true;
    const formArray = this.biltiBillDetails.get(
      'biltiCreationLineItemDetails'
    ) as FormArray;
    const chargesByVendorDetails = formArray.controls.map((control, index) => ({
      id: this.biltiBillDetailsData.biltiCreationLineItemDetails[index].biltiBillProcessChargesByVendor?.id,
      remarks: control.get('remarks')?.value || '',
      debitAmount: control.get('debitAmount')?.value || 0,
      debitRemarks: control.get('debitRemarks')?.value || '',
      creationLineItemId: control.get('id')?.value,
      actionBy: 1,
      status: 'Active',
      freightCharge: this.biltiBillDetailsData?.biltiCreationLineItemDetails[index]?.biltiBillProcessChargesByVendor?.freightCharge,
      pointCharge: this.biltiBillDetailsData?.biltiCreationLineItemDetails[index]?.biltiBillProcessChargesByVendor?.pointCharge,
      detentionCharge: this.biltiBillDetailsData?.biltiCreationLineItemDetails[index]?.biltiBillProcessChargesByVendor?.detentionCharge,
      overloadCharge: this.biltiBillDetailsData?.biltiCreationLineItemDetails[index]?.biltiBillProcessChargesByVendor?.overloadCharge,
      tollTax: this.biltiBillDetailsData?.biltiCreationLineItemDetails[index]?.biltiBillProcessChargesByVendor?.tollTax,
      unloadingCharge: this.biltiBillDetailsData?.biltiCreationLineItemDetails[index]?.biltiBillProcessChargesByVendor?.unloadingCharge,
      otherCharges: this.biltiBillDetailsData?.biltiCreationLineItemDetails[index]?.biltiBillProcessChargesByVendor?.otherCharges,
    }));

    const chargesByLGDetails = {
      id: this.biltiBillDetailsData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.id,
      actionBy: 1,
      status: 'Active',
      freightCharge: this.biltiBillDetailsData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.freightCharge,
      pointCharge: this.biltiBillDetailsData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.pointCharge,
      detentionCharge: this.biltiBillDetailsData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.detentionCharge,
      overloadCharge: this.biltiBillDetailsData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.overloadCharge,
      tollTax: this.biltiBillDetailsData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.tollTax,
      unloadingCharge: this.biltiBillDetailsData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.unloadingCharge,
      otherCharges: this.biltiBillDetailsData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.otherCharges,
      remarks: this.biltiBillDetailsData.biltiBillProcessModel?.biltiBillProcessChargesByLG?.remarks,
    };

    const payload = {
      id: this.biltiBillDetailsData.biltiBillProcessModel?.id,
      actionBy: 1,
      status: this.biltiBillDetailsData.biltiBillProcessModel?.status,
      chargesByVendorDetails: chargesByVendorDetails,
      chargesByLGDetails:chargesByLGDetails,
      debitAmount: this.biltiBillDetailsData?.biltiBillProcessModel?.debitAmount,
      penaltyAmount: this.biltiBillDetailsData?.biltiBillProcessModel?.penaltyAmount,
      penaltyReason: this.biltiBillDetailsData?.biltiBillProcessModel?.penaltyReason,
      excessAmount: this.biltiBillDetailsData?.biltiBillProcessModel?.excessAmount,
      excessReason: this.biltiBillDetailsData?.biltiBillProcessModel?.excessReason,
      grandTotal: this.biltiBillDetailsData?.biltiBillProcessModel?.grandTotal,
      paidByAmount: this.biltiBillDetailsData?.biltiBillProcessModel?.grandTotal,
      batchName: this.biltiBillDetailsData?.transactionTypeDetails?.adviceTypeDetails?.batchName,
      maxBiltiNumber: this.biltiBillDetailsData?.transactionTypeDetails?.adviceTypeDetails?.maxBiltiNumber 
    };

    this.biltiBillService
      .updateBiltiBillProcess(this.biltiBillDetailsData.biltiBillProcessModel?.id, payload)
      .subscribe(
        (response: any) => {
          this.toastr.success('Debit Note Updated Successfully');
          this.loadSpinner = false;
          this.activeModal.close('save');
        },
        (error) => {
          this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
          this.loadSpinner = false;
        }
      );
  }
}
