import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdviceTypeService } from '../../../../core/service/adviceType.service';
import { ToastrService } from 'ngx-toastr';
import { TransactionTypesService } from '../../../../core/service/transactionTypes.service';
import { LookupService } from '../../../../core/service/lookup.service';

@Component({
  selector: 'app-add-edit-advice',
  templateUrl: './add-edit-advice.component.html',
  styleUrls: ['./add-edit-advice.component.scss']
})
export class AddEditAdviceComponent implements OnInit {
  @ViewChild('locationCodeInput', { static: false }) locationCodeInput!: ElementRef;
  adviceForm: FormGroup;
  adviceId: number = 0;
  loadSpinner: boolean = true;
  locationCode: string = '';
  transactionTypesList: any = [];
  locationsDropdownData: any = [];
  transactionTypeId: any;

  constructor(
    private router: Router,
    private _Activatedroute: ActivatedRoute,
    private adviceService: AdviceTypeService,
    private transactionTypesService: TransactionTypesService,
    private toastr: ToastrService,
    private lookupService: LookupService,
    private formBuilder: FormBuilder
  ) {
    this.adviceForm = this.formBuilder.group({
      adviceType: ['', [Validators.required]],
      batchName: [''],
      locationCode: [''],
      maxBiltiLimit: ['', [Validators.required]],
      manualAllocReq: ['Yes', [Validators.required]],
      status: ['Active', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.adviceId = Number(this._Activatedroute.snapshot.paramMap.get('adviceId'));
    this.adviceId = this.adviceId === 0 ? 0 : this.adviceId;
    if (this.adviceId != 0) {
      this.getAdviceTypeData(this.adviceId);
    } else {
      this.getLocations();
    }
    this.loadSpinner = false;
    this.getAllTransactionTypes();
    // Subscribe to changes in adviceType and locationCode form controls to autofill Batch Name
    this.adviceForm.get('adviceType')!.valueChanges.subscribe(value => {
      if (value) {
        this.updateBatchName();
      }
    });

    this.adviceForm.get('locationCode')!.valueChanges.subscribe(value => {
      if (value) {
        this.updateBatchName();
      }
    });
  }

  // Function to get the values for advice type dropdown
  getAllTransactionTypes() {
    let data = {
      code: ''
    };
    this.transactionTypesService.getTransactionTypes(data).subscribe(
      (response: any) => {
        this.transactionTypesList = response.transactionTypes;
        console.log(this.transactionTypesList);
        this.loadSpinner = false;
      },
      error => {
        this.toastr.error(error.error.details.map((detail: any) => detail.description).join(', '));
        this.loadSpinner = false;
      }
    );
  }

  getAdviceTypeData(adviceId: number) {
    this.adviceService.getAdviceTypeData(adviceId).subscribe(
      (response: any) => {
        this.locationCode = response.location.value;
        this.transactionTypeId = response.transactionTypeId;
        this.adviceForm.patchValue({
          adviceType: response.adviceType,
          batchName: response.batchName,
          maxBiltiLimit: response.maxBiltiNumber,
          locationCode: this.locationCode,
          manualAllocReq: response.manualAllocationRequired,
          status: response.status
        });
        this.loadSpinner = false;
      },
      error => {
        this.toastr.error(error.error.details.map((detail: any) => detail.description).join(', '));
        this.loadSpinner = false;
      }
    );
  }

  getLocations() {
    let data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'Locations';
    this.lookupService.getLocationsLookup(data, type).subscribe(
      (res: any) => {
        this.locationsDropdownData = res.lookUps;
        console.log(this.locationsDropdownData, 'this.locationsDropdownData');
      },
      error => {
        this.toastr.error(error.error.details.map((detail: any) => detail.description).join(', '));
      }
    );
  }

  // Function to handle advice type field
  isAdviceTypeTouched(): boolean {
    return this.adviceForm.get('adviceType')!.touched;
  }

  // Function executed on save button click
  onPressSave() {
    this.loadSpinner = true;
    let data = {
      adviceType: this.adviceForm.controls['adviceType'].value.name,
      transactionTypeId: this.adviceForm.controls['adviceType'].value.id,
      batchName: this.adviceForm.controls['batchName']?.value,
      maxBiltiNumber: Number(this.adviceForm.controls['maxBiltiLimit']?.value),
      manualAllocationRequired: this.adviceForm.controls['manualAllocReq']?.value,
      actionBy: 1
    };

    let editData = {
      adviceType: this.isAdviceTypeTouched() ? this.adviceForm.controls['adviceType'].value.name : this.adviceForm.value.adviceType,
      transactionTypeId: this.isAdviceTypeTouched() ? this.adviceForm.controls['adviceType'].value.id : this.transactionTypeId,
      maxBiltiNumber: this.adviceForm.controls['maxBiltiLimit']?.value,
      manualAllocationRequired: this.adviceForm.controls['manualAllocReq']?.value,
      status: this.adviceForm.controls['status']?.value,
      locationCode: this.locationCode || this.adviceForm.get('locationCode')!.value,
      actionBy: 1
    };

    if (this.adviceId > 0) {
      this.updateAdviceType(editData);
    } else {
      this.createNewAdvice(data);
    }
  }

  // Updating advice data
  updateAdviceType(data: any) {
    this.adviceService.updateAdviceType(this.adviceId, data).subscribe(
      (response: any) => {
        this.adviceForm.patchValue({
          adviceType: response.adviceType,
          batchName: response.batchName,
          maxBiltiLimit: response.maxBiltiNumber,
          locationCode: this.locationCode,
          manualAllocReq: response.manualAllocationRequired,
          status: response.status
        });
        this.loadSpinner = false;
        this.toastr.success('Advice Type Updated Successfully');
      },
      error => {
        this.toastr.error(error.error.details.map((detail: any) => detail.description).join(', '));
        this.loadSpinner = false;
      }
    );
  }

  // Creating new advice
  createNewAdvice(data: any) {
    this.adviceService.createAdviceType(data).subscribe(
      (response: any) => {
        this.loadSpinner = false;
        this.toastr.success('Advice Type Created Successfully');
        this.router.navigate(['/master/advice']);
      },
      error => {
        this.toastr.error(error.error.details.map((detail: any) => detail.description).join('\n'));
        this.loadSpinner = false;
      }
    );
  }

  updateBatchName() {
    const adviceType = this.adviceForm.get('adviceType')!.value;
    const locationCode = this.adviceId === 0
      ? this.adviceForm.get('locationCode')!.value
      : this.locationCodeInput.nativeElement.value;

    if (adviceType && locationCode) {
      const selectedAdvice = this.transactionTypesList.find((advice: any) => advice.name === adviceType.name);
      if (selectedAdvice) {
        this.adviceForm.get('batchName')!.setValue(`${selectedAdvice.code}_${locationCode}`);
      }
    }
  }

  onCancelPress() {
    this.router.navigate(['/master/advice']);
  }
}
