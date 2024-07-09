import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdviceTypeService } from '../../../../core/service/adviceType.service';
import { ToastrService } from 'ngx-toastr';
import { TransactionTypesService } from '../../../../core/service/transactionTypes.service';
import { LookupService } from '../../../../core/service/lookup.service';
import { APIConstant } from '../../../../core/constants';

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
  locationId!: Number;
  locations: any[] = APIConstant.locationsListDropdown;
  advicesList: any = [];
  adviceLocationId: number = 0;

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
      locationCode: ['', [Validators.required]],
      maxBiltiLimit: ['', [Validators.required]],
      manualAllocReq: ['Yes', [Validators.required]],
      status: ['Active', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.adviceId = Number(this._Activatedroute.snapshot.paramMap.get('adviceId'));
    this.adviceId = this.adviceId === 0 ? 0 : this.adviceId;
    if (this.adviceId != 0) {
      this.getAdviceEditData();
    } else {
      //this.getLocations();
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
    this.setLocation();
  }

  // Function to get the values for advice type dropdown
  getAllTransactionTypes() {
    let data = {
      code: ''
    };
    this.transactionTypesService.getTransactionTypes(data).subscribe(
      (response: any) => {
        this.transactionTypesList = response.transactionTypes;
        this.loadSpinner = false;
      },
      error => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  getAdviceTypeData(adviceId: number) {
    this.adviceService.getAdviceTypeData(this.adviceLocationId,adviceId).subscribe(
      (response: any) => {
        this.locationCode = response.location.value;
        this.transactionTypeId = response.transactionTypeId;
        this.adviceForm.patchValue({
          adviceType: response.adviceType,
          batchName: response.batchName,
          maxBiltiLimit: response.maxBiltiNumber,
          locationCode: response.location.id,
          manualAllocReq: response.manualAllocationRequired,
          status: response.status
        });
        this.loadSpinner = false;
      },
      error => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  // getLocations() {
  //   let data = {
  //     CreationDate: '',
  //     LastUpdatedBy: '',
  //     LastUpdateDate: '',
  //   };
  //   const type = 'Locations';
  //   this.lookupService.getLocationsLookup(data, type).subscribe(
  //     (res: any) => {
  //       this.locationsDropdownData = res.lookUps;
  //       console.log(this.locationsDropdownData, 'this.locationsDropdownData');
  //     },
  //     error => {
  //       //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
  //     }
  //   );
  // }

  // Function to handle advice type field
  isAdviceTypeTouched(): boolean {
    return this.adviceForm.get('adviceType')!.touched;
  }

  // Function executed on save button click
  onPressSave() {
    this.loadSpinner = true;
    const adviceTypeControl = this.adviceForm.controls['adviceType'];
    const adviceTypeValue = adviceTypeControl.value;
    let data = {
      adviceType: adviceTypeValue && adviceTypeValue.name ? adviceTypeValue.name : '',
      transactionTypeId: (adviceTypeValue && adviceTypeValue.id ? adviceTypeValue.id : null) || 0,
      batchName: this.adviceForm.controls['batchName']?.value || '',
      maxBiltiNumber: Number(this.adviceForm.controls['maxBiltiLimit']?.value),
      manualAllocationRequired: this.adviceForm.controls['manualAllocReq']?.value,
      actionBy: localStorage.getItem("userId")
    };

    let editData = {
      adviceType: this.isAdviceTypeTouched() && adviceTypeValue && adviceTypeValue.name ? adviceTypeValue.name : this.adviceForm.value.adviceType,
      transactionTypeId: this.isAdviceTypeTouched() && adviceTypeValue && adviceTypeValue.id ? adviceTypeValue.id : this.transactionTypeId,
      maxBiltiNumber: this.adviceForm.controls['maxBiltiLimit']?.value || 0,
      manualAllocationRequired: this.adviceForm.controls['manualAllocReq']?.value,
      status: this.adviceForm.controls['status']?.value,
      locationCode: this.locationCode || this.adviceForm.get('locationCode')!.value,
      actionBy: localStorage.getItem("userId")
    };

    if (this.adviceId > 0) {
      this.updateAdviceType(editData);
    } else {
      this.createNewAdvice(data);
    }
  }

  // Updating advice data
  updateAdviceType(data: any) {
    const locationCode = this.adviceForm.controls['locationCode']?.value
    this.adviceService.updateAdviceType(locationCode,this.adviceId, data).subscribe(
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
        this.router.navigate(['master/advice']);
      },
      error => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  // Creating new advice
  createNewAdvice(data: any) {
    const locationCode = this.adviceForm.controls['locationCode']?.value
    this.adviceService.createAdviceType(locationCode,data).subscribe(
      (response: any) => {
        this.loadSpinner = false;
        this.toastr.success('Advice Type Created Successfully');
        this.router.navigate(['/master/advice']);
      },
      error => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  updateBatchName() {
    const adviceType = this.adviceForm.get('adviceType')!.value;
    const locationCode = this.adviceId === 0
      ? this.adviceForm.get('locationCode')!.value
      : this.locationCodeInput.nativeElement.value;
      const locationName = this.locations.find((item: any) => {
        return item?.id == locationCode
      })
    if (adviceType && adviceType.name && locationCode) {
      const selectedAdvice = this.transactionTypesList.find((advice: any) => advice.name === adviceType.name);
      if (selectedAdvice) {
        this.adviceForm.get('batchName')!.setValue(`${selectedAdvice.code}_${locationName?.code}`);
      }
    }
  }

  onCancelPress() {
    this.router.navigate(['/master/advice']);
  }

  setLocation(){
    if(!this.adviceId){
      this.lookupService.setLocationId(this.adviceForm, this.locations, 'locationCode');
    }
  }

  getAdviceEditData() {
    let data = {
      "locationIds": APIConstant.locationsListDropdown.map((e:any)=>(e.id)),
      "adviceType": ""
    }
    this.adviceService.getAdviceTypes(data).subscribe((response: any) => {
      this.advicesList = response.advices;
      this.getLocationId().then(() => {
        this.getAdviceTypeData(this.adviceId);
      });
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
    })
  }

  getLocationId(): Promise<void> {
    return new Promise((resolve, reject) => {
      const advice = this.advicesList.filter((item: any) => {
        return item.id == this.adviceId
      });
      if (advice.length > 0) {
        this.adviceLocationId = advice[0].location.id;
        resolve();
      } else {
        reject('No matching advice found');
      }
    });
  }
}
