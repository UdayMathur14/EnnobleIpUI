import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-debit-note-details-modal',
  templateUrl: './debit-note-details.component.html',
  styleUrl: './debit-note-details.component.scss'
})
export class DebitNoteDetailsModalComponent implements OnInit {
  @Input() biltiProcess: any;
  loadSpinner: boolean = true;
  biltiBillDetails!: FormGroup;
  biltiBillDetailsData: any;
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private biltiBillService: BiltiBillProcessService,
    private toastr: ToastrService,
    private router: Router
  ) { }
  ngOnInit(): void {
    console.log(this.biltiProcess)
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
      paidByDetails:[''],
      remarks:[''],
      debitRemarks:[''],
      debitAmount:[''],
      biltiCreationLineItemDetails: this.formBuilder.array([])
    });
  }

  get biltiCreationLineItemDetails(): FormArray {
    return this.biltiBillDetails.get('biltiCreationLineItemDetails') as FormArray;
  }

  createLineItem(item: any): FormGroup {
    return this.formBuilder.group({
      paidByDetails: [item.supplierDetail?.paidByDetails?.value || ''],
      vendorName: [item.supplierDetail?.vendorName || ''],
      remarks: [item.remarks || ''],
      id: [item.id],
      debitAmount: [this.biltiBillDetailsData.biltiBillProcessModel?.penaltyAmount || 0],
      debitRemarks: [this.biltiBillDetailsData.biltiBillProcessModel?.penaltyReason || '']
    });
  }

  getBiltiBillProcessbyId() {
    this.biltiBillService.getBiltiBillProcessbyId(this.biltiProcess.id).subscribe((response => {
      this.biltiBillDetailsData = response;
      console.log(this.biltiBillDetailsData,"data details");
      
      // this.transactionTypeId = this.biltiBillProcessData.transactionTypeId;
      // this.maxBiltiNumber = this.biltiBillProcessData.transactionTypeDetails.adviceTypeDetails.maxBiltiNumber;
      // this.transacttionTypeCode = this.biltiBillProcessData.transactionTypeDetails.code;
      this.populateForm();
    }));
  }

  populateForm(): void {
    if (this.biltiBillDetailsData) {
      // this.calculateTotals();
      this.biltiBillDetails.patchValue({
        biltiNumber: this.biltiBillDetailsData.biltiNumber,
        creationDate: this.biltiBillDetailsData.creationDate,
        adviceType: this.biltiBillDetailsData.transactionTypeDetails?.name,
        freightAmount: this.biltiBillDetailsData.biltiBillProcessModel?.debitAmount
      });

      const biltiCreationLineItemDetailsData = this.biltiBillDetailsData.biltiCreationLineItemDetails;
      console.log(this.biltiBillDetailsData.biltiCreationLineItemDetails);
      

      if (biltiCreationLineItemDetailsData) {
        const formArray = this.biltiBillDetails.get('biltiCreationLineItemDetails') as FormArray;
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
  const formArray = this.biltiBillDetails.get('biltiCreationLineItemDetails') as FormArray;
  const chargesByVendorDetails = formArray.controls.map((control, index) => ({
    id: this.biltiBillDetailsData.biltiCreationLineItemDetails[index].id,
    remarks: control.get('remarks')?.value || '',
    debitAmount: control.get('debitAmount')?.value || 0,
    debitRemarks: control.get('debitRemarks')?.value || '',
    creationLineItemId: control.get('id')?.value,
    actionBy:1,
    status:"Active"
  }));

  const payload = {
    id: this.biltiBillDetailsData.id,
    actionBy: 1,
    status:"Active",
    chargesByVendorDetails: chargesByVendorDetails
  };

  this.loadSpinner = true;
  this.biltiBillService.updateBiltiBillProcess(this.biltiProcess.id, payload).subscribe(
    (response: any) => {
      this.toastr.success('Bilti Updated Successfully');
      this.router.navigate(['transaction/bilti']);
      this.loadSpinner = false;
    },
    (error) => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    }
  );
}

}
