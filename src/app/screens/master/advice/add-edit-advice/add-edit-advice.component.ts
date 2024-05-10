import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdviceTypeService } from '../../../../core/service/adviceType.service';
import { ToastrService } from 'ngx-toastr';
import { TransactionTypesService } from '../../../../core/service/transactionTypes.service';
import { TransactionTypeListModel } from '../../../../core/model/masterModels.model';

@Component({
  selector: 'app-add-edit-advice',
  templateUrl: './add-edit-advice.component.html',
  styleUrl: './add-edit-advice.component.scss'
})
export class AddEditAdviceComponent implements OnInit {
  adviceForm: FormGroup
  adviceId: number = 0;
  loadSpinner: boolean = true;
  locationCode: string = '';
  transactionTypesList: any = [];
  transactionTypeId: any;
  constructor(private router: Router,
    private _Activatedroute: ActivatedRoute,
    private adviceService: AdviceTypeService,
    private transactionTypesService: TransactionTypesService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder) {
    this.adviceForm = this.formBuilder.group({
      adviceType: ['', [Validators.required]],
      batchName: [''],
      maxBiltiLimit: ['', [Validators.required]],
      manualAllocReq: ['Yes', [Validators.required]],
      status: ['Active', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.adviceId = Number(this._Activatedroute.snapshot.paramMap.get("adviceId"));
    this.adviceId = this.adviceId === 0 ? 0 : this.adviceId;
    if (this.adviceId != 0) {
      this.getAdviceTypeData(this.adviceId);
    }
    this.loadSpinner = false;
    this.getAllTransactionTypes();
  }

  //FUNCTON TO GET THE VALUES FOR ADVICE TYPE DROPDOWN
  getAllTransactionTypes() {
    let data = {
      "code": ''
    }
    this.transactionTypesService.getTransactionTypes(data).subscribe((response: any) => {
      this.transactionTypesList = response.transactionTypes;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

  getAdviceTypeData(adviceId: number) {
    this.adviceService.getAdviceTypeData(adviceId).subscribe((response: any) => {
      this.locationCode = response.location.value
      this.transactionTypeId = response.transactionTypeId;
      console.log(this.transactionTypeId, "tt");

      this.adviceForm.patchValue({
        adviceType: response.adviceType,
        batchName: response.batchName,
        maxBiltiLimit: response.maxBiltiNumber,
        manualAllocReq: response.manualAllocationRequired,
        status: response.status
      });
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

  // FUNCTION TO HANDLE ADVICE TYPE FIELD
  isAdviceTypeTouched(): boolean {
    return this.adviceForm.get('adviceType')!.touched;
  }
  //FUNCTION EXECUTED ON SAVE BUTTON CLICK
  onPressSave() {
    this.loadSpinner = true;
    let data = {
      adviceType: this.adviceForm.controls['adviceType'].value.name,
      transactionTypeId: this.adviceForm.controls['adviceType'].value.id,
      batchName: this.adviceForm.controls['batchName']?.value,
      maxBiltiNumber: this.adviceForm.controls['maxBiltiLimit']?.value,
      manualAllocationRequired: this.adviceForm.controls['manualAllocReq']?.value,
      actionBy: 1
    }
    let editData = {
      adviceType: this.isAdviceTypeTouched() ? this.adviceForm.controls['adviceType'].value.name : this.adviceForm.value.adviceType,
      transactionTypeId: this.isAdviceTypeTouched() ? this.adviceForm.controls['adviceType'].value.id : this.transactionTypeId,
      maxBiltiNumber: this.adviceForm.controls['maxBiltiLimit']?.value,
      manualAllocationRequired: this.adviceForm.controls['manualAllocReq']?.value,
      status: this.adviceForm.controls['status']?.value,
      actionBy: 1
    }
    if (this.adviceId > 0) {
      this.updateAdviceType(editData);
    } else {
      this.createNewAdvice(data);
    }
  }

  //UPDATING PART DATA
  updateAdviceType(data: any) {
    this.adviceService.updateAdviceType(this.adviceId, data).subscribe((response: any) => {
      this.adviceForm.setValue({
        adviceType: response.adviceType,
        batchName: response.batchName,
        maxBiltiLimit: response.maxBiltiNumber,
        manualAllocReq: response.manualAllocationRequired,
        status: response.status
      });
      this.loadSpinner = false;
      this.toastr.success('Advice Type Updated Successfully');
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

  //CREATING NEW PART
  createNewAdvice(data: any) {
    this.adviceService.createAdviceType(data).subscribe((response: any) => {
      this.loadSpinner = false;
      this.toastr.success('Advice Type Created Successfully');
      this.router.navigate(['/master/advice'])
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

  onCancelPress() {
    this.router.navigate(['/master/advice'])
  }
}
