import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bilti-process-details-modal',
  templateUrl: './bilti-process-details.component.html',
  styleUrl: './bilti-process-details.component.scss'
})
export class BiltiProcessDetailsModalComponent implements OnInit {
  @Input() biltiProcess: any;
  biltiBillProcess!: FormGroup;
  biltiBillProcessData: any;
  constructor(
    public activeModal: NgbActiveModal,
    private biltiBillService: BiltiBillProcessService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    // logs -->
    // console.log(this.biltiProcess, "modal data");
    // console.log(this.biltiProcess.id, "bilti Id");
    // console.log(this.biltiBillProcessData.biltiCreationLineItemDetails?.supplierDetail?.vendorName,"vendor Name");
    //<----
    this.getBiltiBillProcessbyId();
    this.initForm();
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
      excessReason: ['']
    });
  }

  getBiltiBillProcessbyId() {
    this.biltiBillService.getBiltiBillProcessbyId(this.biltiProcess.id).subscribe((response => {
      console.log(response, "response");
      this.biltiBillProcessData = response;
      console.log(this.biltiBillProcessData.biltiNumber,"this.biltiBillProcessData");
     
    console.log(this.biltiBillProcessData.biltiCreationLineItemDetails?.supplierDetail?.vendorName,"vendor Name");
      
      this.populateForm();

    }))
  }

  populateForm(): void {
    // const vendorNames = this.biltiBillProcessData.biltiCreationLineItemDetails
    //   .map((item: any) => item.supplierDetail.vendorName)
    //   ;
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
  }

}
