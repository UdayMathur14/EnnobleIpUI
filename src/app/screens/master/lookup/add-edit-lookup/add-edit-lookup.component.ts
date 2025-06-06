import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from '../../../../core/service/lookup.service';
import { LookupDataModel } from '../../../../core/model/masterModels.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-lookup',
  templateUrl: './add-edit-lookup.component.html',
  styleUrl: './add-edit-lookup.component.scss'
})
export class AddEditLookupComponent implements OnInit {
  lookupForm: FormGroup;
  lookupData!: LookupDataModel;
  lookupId: number = 0;
  filledDetails: any;
  loadSpinner: boolean = true;
  lookupTypes: any;
  showFilledDetails: boolean = false;
  selectedLookupType: any;

  constructor(
    private router: Router,
    private lookupService: LookupService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {
    this.lookupForm = this.formBuilder.group({
      typeId: ['', Validators.required],
      code: ['', Validators.required],
      value: ['', Validators.required],
      description: ['', Validators.required],
      status: ['Active', Validators.required],
    })
  }

  ngOnInit(): void {
    this.lookupId = Number(this.activatedRoute.snapshot.paramMap.get("lookupId"));
    console.log(this.lookupId);
    this.lookupId = this.lookupId == 0 ? 0 : this.lookupId;
    if (this.lookupId != 0) {
      this.getLookupData(this.lookupId);
    } else {
      this.getLookupTypes();
    }
  }

  getLookupTypes() {
    let data = {
      type:""
    };
    this.lookupService.getLookupTypeDrop(data).subscribe((response: any) => {
      if(this.lookupId == 0){
        this.lookupTypes = response.lookUpTypes;
        console.log("uday");
      }
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    });
  }
  

  //TO GET SELECTED LOOKUP DATA
  getLookupData(lookupId: number) {
    this.lookupService.getLookupDatas(lookupId).subscribe((response: any) => {
      this.selectedLookupType = response?.lookUpType?.type
      this.lookupForm.patchValue({
        typeId: response.typeId,
        code: response.code,
        value: response.value,
        description: response.description,
        status: response.status
      });

      this.lookupTypes = [response.lookUpType];
      this.selectedLookupType = response?.lookUpType?.value
      
      this.loadSpinner = false;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    });
  }

  //FUNCTION EXECUTED ON SUBMIT BUTTON CLICK
  onPressSubmit() {
    this.loadSpinner = true;
    let data = {
      typeId: Number(this.lookupForm.controls['typeId'].value),
      code: this.lookupForm.controls['code'].value,
      value: this.lookupForm.controls['value'].value,
      description: this.lookupForm.controls['description'].value,
      status: this.lookupForm.controls['status'].value,
      actionBy: ""
    }
    if (this.lookupId > 0) {
      this.updateLookup(data);
    } else {
      this.createNewLookup(data);
    }
  }

  //UPDATING LOOKUP DATA
  updateLookup(data: any) {
    this.lookupService.updateLookup(this.lookupId, data).subscribe((response: any) => {
      this.lookupData = response;
      this.loadSpinner = false;
      this.toastr.success('Lookup Updated Successfully');
      this.router.navigate(['/master/lookup']);
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  //CREATE NEW LOOKUP
  createNewLookup(data: any) {
    this.lookupService.createLookup(data).subscribe((response: any) => {
      this.lookupData = response;
      this.loadSpinner = false;
      this.toastr.success('Lookup Created Successfully');
      this.router.navigate(['/master/lookup']);
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  //PREVIEW OF UPDATED AND CREATED DATA ON SAVE BUTTON CLICK
  onSaveButtonClick() {
    this.updateFilledDetails();
    this.showFilledDetails = true;
  }

  //EXECUTED ON SAVE BUTTON CLICK TO SHOW DATA PREVIEW
  updateFilledDetails() {
    const typeId = this.lookupForm.controls['typeId'].value;
    const lookupType = this.lookupTypes.find((type: any) => type.id === typeId);

    this.filledDetails = {
      typeId: lookupType ? lookupType.type : '',
      code: this.lookupForm.controls['code'].value,
      value: this.lookupForm.controls['value'].value,
      description: this.lookupForm.controls['description'].value,
      status: this.lookupForm.controls['status'].value
    };
  }

  onCancelPress() {
    this.router.navigate(['/master/lookup'])
  }

  selecetLookupType(e: any){
      this.selectedLookupType = e?.target?.innerText
  }

}